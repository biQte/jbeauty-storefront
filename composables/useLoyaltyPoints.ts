export function useLoyaltyPoints() {
    const getLoyaltyPoints = async () => {
        return await useFetch(`/api/customers/me/loyalty-points`, {
            method: "GET",
            credentials: "include"
        });
    }

    const calculatePointsForProduct = async (productHandle: string) => {
        return await useFetch(
            `/api/products/handle/${productHandle}/calculate-loyalty-points`,
            {
                credentials: 'include',
                method: "GET",
            }
        );
    }

    return { getLoyaltyPoints, calculatePointsForProduct }
}
