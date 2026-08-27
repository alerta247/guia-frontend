"use server";

import { Product } from "@/sanity.types";
import { createClient } from "next-sanity";

export const getWheelOfFortuneConfiguration = async () => {
    let randomProducts: Product[] = [];

    try {
        const client = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
            useCdn: true,
        });

        randomProducts = await client.fetch<Product[]>(
            `*[_type == "product"][0..6]`
        );
    } catch {
        randomProducts = [];
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const winningIndex = randomProducts.length > 0
        ? (day * 31 + month * 12 + year) % randomProducts.length
        : 0;

    return {
        randomProducts,
        winningIndex,
    }
}