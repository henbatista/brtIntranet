<script lang="tsx" setup>
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import type { TDepartament } from "@/types/departament";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useDepartmentStore } from "@/stores/DepartmentStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const departamentStore = useDepartmentStore();

const onDelete = async (data: TDepartament) => {
    alertStore.loading = true;
    await departamentStore.deleteDepartment(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TDepartament) => {
    alertStore.loading = true;
    await departamentStore.updateDepartment({
        ...data,
        department_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns = [
    {
        field: "department_id",
        header: "ID Departamento",
    },
    {
        field: "department_name",
        header: "Nome",
        style: "flex: 1",
    },
    {
        field: "department_status",
        header: "Status",
        render: (value: boolean, data: TDepartament) => (
            <StatusComponent
                status={value}
                onChangeStatus={(status: boolean) =>
                    onChangeStatus(status, data)
                }
            />
        ),
    },
    {
        field: "actions",
        header: "",
        render: (_v: string, data: TDepartament) => (
            <EditAndDeleteTableButton
                onEdit={() => editCompany(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

const modalData = ref();

const openModal = ref(false);

const editCompany = async (data: TDepartament) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};
</script>
<template>
    <div>
        <ModalComponent
            :title="
                modalData ? 'Editar Departamento' : 'Cadastro de Departamento'
            "
            :open="openModal"
        >
            <PagesDepartamentoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Departamentos"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="editCompany"
                    :onAddNew="onOpenModal"
                    apiUrl="admin/departamento/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
