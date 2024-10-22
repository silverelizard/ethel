interface Bottle {
    id: number;
    name: string;
    category_id: number;
    sub_category_ids: number[];
    storage_id: number;
}

const getBottles = async () => {
    let bottles: Bottle[] = [];
    try {
        const response = await fetch(`http://localhost:8000/bottles`);
        bottles = await response.json();
    }
    catch(error) {
        console.error(error);
        bottles = testBottleData; // for local dev testing
    }

    return bottles;
};

const testBottleData: Bottle[] = [
    {
        id: 1,
        name: 'Bottle 1',
        category_id: 1,
        sub_category_ids: [1,2],
        storage_id: 1
    },
    {
        id: 2,
        name: 'Bottle 2',
        category_id: 1,
        sub_category_ids: [3,4],
        storage_id: 2
    },
    {
        id: 3,
        name: 'Bottle 3',
        category_id: 2,
        sub_category_ids: [5],
        storage_id: 1
    }
];
  
export { getBottles, testBottleData };
export type { Bottle };
