import { Td, Tr } from "@chakra-ui/react";
import { Bottle } from "../client/bottles";

function BottleRow(props: { bottle: Bottle }) {
    const bottle = props.bottle;
    return (
      <Tr key={bottle.id}>
        <Td>{bottle.name}</Td>
        <Td>{bottle.category_id}</Td>
        <Td>{bottle.sub_category_ids.join(', ')}</Td>
        <Td>{bottle.storage_id}</Td>
      </Tr>
    );
}

export default BottleRow;