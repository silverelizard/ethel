import { Td, Tr } from "@chakra-ui/react";
import { Bottle } from "../client/bottles";
import { Category } from "../client/categories";
import { SubCategory } from "../client/subCategories";
import { Storage } from "../client/storage";
import { IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

function BottleRow(props: { bottle: Bottle, category: Category, subCategories: SubCategory[], storage: Storage }) {
    const {bottle, category, subCategories, storage } = props;
    return (
      <Tr>
        <Td><IconButton aria-label='Edit Bottle' variant='ghost' colorScheme='blue' icon={<EditIcon />} /></Td>
        <Td>{bottle.name}</Td>
        <Td>{category.name}</Td>
        <Td>{subCategories.map((sub) => sub.name).join(', ')}</Td>
        <Td>{storage.room} - {storage.name} - {storage.shelf}</Td>
        <Td><IconButton aria-label='Delete Bottle' variant='ghost' colorScheme='red' icon={<DeleteIcon />} /></Td>
      </Tr>
    );
}

export default BottleRow;