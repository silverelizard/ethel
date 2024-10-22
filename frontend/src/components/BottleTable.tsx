import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Tfoot, IconButton } from "@chakra-ui/react";
import BottleRow from "./BottleRow";
import { Bottle } from "../client/bottles";
import { Category } from "../client/categories";
import { SubCategory } from "../client/subCategories";
import { Storage } from "../client/storage";
import { AddIcon } from "@chakra-ui/icons";
import ControlRow from "./ControlRow";

interface BottleTableProps {
    bottles: Bottle[];
    categories: { [id: number] : Category; };
    subCategories: { [id: number] : SubCategory; };
    storage: { [id: number] : Storage; };
}
function BottleTable(props: BottleTableProps) {
    const { bottles, categories, subCategories, storage } = props;
    return (
        <div>
          <TableContainer>
            <Table variant='striped'>
              <TableCaption>Bottle List</TableCaption>
              <Thead>
                <ControlRow />
              </Thead>
              <Tbody>
                { bottles.map((bottle) => 
                  <BottleRow key={bottle.id} bottle={bottle} 
                    category={categories[bottle.category_id]}
                    subCategories={bottle.sub_category_ids.map((sub => subCategories[sub]))}
                    storage={storage[bottle.storage_id]} />
                )}
              </Tbody>
              <Tfoot>
                <ControlRow />
              </Tfoot>
            </Table>
          </TableContainer>
        </div>
      );
}

export default BottleTable;
