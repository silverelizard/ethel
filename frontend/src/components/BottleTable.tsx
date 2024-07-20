import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Tfoot } from "@chakra-ui/react";
import BottleRow from "./BottleRow";
import { Bottle } from "../client/bottles";

interface BottleTableProps {
    bottles: Bottle[];
}
function BottleTable(props: BottleTableProps) {
    const bottles = props.bottles;
    return (
        <div>
          <TableContainer>
            <Table variant='striped'>
              <TableCaption>Bottle List</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Sub Categories</Th>
                  <Th>Storage</Th>
                </Tr>
              </Thead>
              <Tbody>
                { bottles.map((bottle) => <BottleRow bottle={bottle} />)}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Sub Categories</Th>
                  <Th>Storage</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </div>
      );
}

export default BottleTable;
