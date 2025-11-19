// client/src/store/product.js

// Use the environment variable for the API base URL.
// Vite uses import.meta.env for environment variables prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Fallback for local development

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),

	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}
		// Use the API_BASE_URL for the fetch call
		const res = await fetch(`${API_BASE_URL}/api/products`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});
		const data = await res.json();
		set((state) => ({ products: [...state.products, data.data] }));
		return { success: true, message: "Product created successfully" };
	},

	fetchProducts: async () => {
		// Use the API_BASE_URL for the fetch call
		const res = await fetch(`${API_BASE_URL}/api/products`);
		const data = await res.json();
		set({ products: data.data });
	},

	deleteProduct: async (pid) => {
		// Use the API_BASE_URL for the fetch call
		const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},

	updateProduct: async (pid, updatedProduct) => {
		// Use the API_BASE_URL for the fetch call
		const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({
			products: state.products.map((product) => (product._id === pid ? data.data : product)),
		}));

		return { success: true, message: data.message };
	},
}));
