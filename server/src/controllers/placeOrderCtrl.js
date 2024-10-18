import asyncHandler from 'express-async-handler';
import { db } from '../config/db.js';
import { courierCharges } from '../schemas/drizzle-schemas.js';

const getCourierCostFromDB = async () => {
    try {
        const rows = await db.select().from(courierCharges);
        return rows.length > 0 ? rows : null;
    } catch (error) {
        console.error('Error fetching courier costs from DB:', error);
        return null;
    }
};

// Function to calculate courier cost based on weight
function calculateCourierCost(weight, COURIER_COSTS) {
    for (const cost of COURIER_COSTS) {
        const [min, max] = cost.range.split('-').map(w => parseInt(w));
        if (weight >= min && weight <= max) {
            return cost.price;
        }
    }
    return 0;
}

// Function to balance weights between packages by redistributing items
function balancePackages(packages) {
    let totalWeight = packages.reduce((sum, pkg) => sum + pkg.totalWeight, 0);
    let averageWeight = totalWeight / packages.length;

    // Sort packages by total weight in descending order
    packages.sort((a, b) => b.totalWeight - a.totalWeight);

    for (let i = 0; i < packages.length - 1; i++) {
        let currentPackage = packages[i];

        // Move items from the heavier package to the next one until weights are balanced
        for (let j = i + 1; j < packages.length; j++) {
            const nextPackage = packages[j];

            while (currentPackage.totalWeight > averageWeight && nextPackage.totalWeight < averageWeight) {
                const productToMove = currentPackage.items.pop(); // Remove the last item (heaviest remaining)

                if (productToMove) {
                    currentPackage.totalWeight -= productToMove.weight;
                    nextPackage.items.push(productToMove);
                    nextPackage.totalWeight += productToMove.weight;
                } else {
                    break; // Stop if no more items can be moved
                }
            }
        }
    }

    return packages;
}

export const getPlaceOrder = asyncHandler(async (req, res) => {
    try {
        const products = req.body.products;

        const dbCourierCosts = await getCourierCostFromDB();
        const COURIER_COSTS = dbCourierCosts ?? [
            { range: '0-200', price: 5 },
            { range: '200-500', price: 10 },
            { range: '500-1000', price: 15 },
            { range: '1000-5000', price: 20 },
        ];

        // Sort products by weight in ascending order
        products.sort((a, b) => a.weight - b.weight);

        let packages = [];
        let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

        for (const product of products) {
            // Check if adding the product would exceed the $250 limit
            if (currentPackage.totalPrice + product.price > 250) {
                // Finalize current package and start a new one
                packages.push(currentPackage);
                currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };
            }

            // Add product to the package
            currentPackage.items.push(product);
            currentPackage.totalWeight += product.weight;
            currentPackage.totalPrice += product.price;
        }

        // Add the last package
        if (currentPackage.items.length > 0) {
            packages.push(currentPackage);
        }

        // Balance the packages to distribute weight evenly
        packages = balancePackages(packages);

        // Calculate the courier price for each package
        packages = packages.map(pkg => ({
            ...pkg,
            courierPrice: calculateCourierCost(pkg.totalWeight, COURIER_COSTS),
        }));

        res.json({ packages });
    } catch (error) {
        console.error('Error while placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});
