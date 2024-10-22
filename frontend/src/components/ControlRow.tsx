import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Th, Tr } from "@chakra-ui/react";

function AddNewControls(props: {}) {
    return (
        <Tr>
            <Th>Name</Th>
            <Th>Category <IconButton size='sm' variant='ghost' colorScheme='green' aria-label='Add Category' icon={<AddIcon />} /></Th>
            <Th>Sub Categories <IconButton size='sm' variant='ghost' colorScheme='green' aria-label='Add Sub Category' icon={<AddIcon />} /></Th>
            <Th>Storage <IconButton size='sm' variant='ghost' colorScheme='green' aria-label='Add Storage' icon={<AddIcon />} /></Th>
        </Tr>
    );
}

export default AddNewControls;
