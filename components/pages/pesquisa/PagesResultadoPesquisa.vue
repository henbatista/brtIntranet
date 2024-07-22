<script lang="ts" setup>
const headConfig: Ref<{
    text: string;
    value: string;
}[]> = ref([
    { text: "Loc", value: "loc" },
    { text: "OD", value: "od" },
    { text: "Agência", value: "agency" },
    { text: "Base", value: "base" },
    { text: "E-Mail Agência", value: "mailAgency" },
    { text: "Criado Por", value: "createBy" },
    { text: "E-Mail Emissor", value: "mailEmissor" },
]);

type ObjectResponse = {
    [key: string]: string | number | Date;
};

let tableData: Ref<ObjectResponse[]> = ref([
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
  { loc: 'Teste' },
]);

</script>
<template>
    <CommonInputDataTable key-field-name="" title="" type="" :head-config="headConfig" :table-data="tableData"/>
</template>