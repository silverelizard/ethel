import { Td, Tr } from "@chakra-ui/react";
import { Bottle } from "../client/bottles";
import { Category } from "../client/categories";
import { SubCategory } from "../client/subCategories";
import { Storage } from "../client/storage";

function BottleRow(props: { bottle: Bottle, category: Category, subCategories: SubCategory[], storage: Storage }) {
    const {bottle, category, subCategories, storage } = props;
    return (
      <Tr>
        <Td>{bottle.name}</Td>
        <Td>{category.name}</Td>
        <Td>{subCategories.map((sub) => sub.name).join(', ')}</Td>
        <Td>{storage.room} - {storage.name} - {storage.shelf}</Td>
      </Tr>
    );
}

export default BottleRow;