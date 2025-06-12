// import { auth } from "@/auth";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetUserInfo = (email: string) => {
    const { data: user = [], isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            // const session = await auth();
            const response = await fetch(`${API_URL}api/user/${email}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const user = await response.json();
            return user;
        },
        staleTime: 1000 * 60 * 10,
    });

    return { user, isLoading, error };
};