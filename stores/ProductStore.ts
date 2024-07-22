import { defineStore } from "pinia";
import ProductService from "../utils/products.service";
import { useAlertStore } from "./AlertStore";

export const useProductStore = defineStore(
    "ProductStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const blankProduct = {
            name: " ",
            product_id: " ",
            product_status: 1,
        };

        const Products = ref([]);
        const Product = ref({});
        const ProductPagination = ref({});

        // actions
        const $reset = (): void => {
            Product.value = [];
        };

        const getProducts = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            let ProductList: any = await ProductService.getProducts(
                search,
                page,
                per_page,
                field
            );
            alertStore.loading = false;
            Products.value = ProductList.data.data;
            ProductPagination.value = ProductList.data;
        };

        const saveProduct = async (data: any) => {
            alertStore.loading = true;
            try {
                await ProductService.saveProduct(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Produto salvo com sucesso!";
                Product.value = blankProduct;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateProduct = async (data: any) => {
            alertStore.loading = true;
            try {
                await ProductService.updateProduct(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Produto atualizado com sucesso!";
                Product.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteProduct = async (data: any) => {
            alertStore.loading = true;
            try {
                await ProductService.deleteProduct(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Produto deletado com sucesso!";
                Product.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            ProductPagination,
            Products,
            Product,
            $reset,
            getProducts,
            saveProduct,
            updateProduct,
            deleteProduct,
        };
    },
    { persist: true }
);
