import { Skeleton, Table } from '@chakra-ui/react';

function TableSkeleton() {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <Skeleton height='20px' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height='20px' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height='20px' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height='20px' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height='20px' />
            </Table.Cell>
          </Table.Row>
        ))}
    </>
  );
}

export default TableSkeleton;
