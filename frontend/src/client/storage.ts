interface Storage {
    id: number;
    name: string;
    room: string;
    shelf: string;
}

const getStorage = async () => {
    let storage: Storage[] = [];
    try {
        const response = await fetch(`http://localhost:8000/storage`);
        storage = await response.json();
    }
    catch(error) {
        console.error(error);
        storage = testStorageData;
    }
    return storage.reduce((result, sto) => {
        result[sto.id] = sto;
        return result;
      }, {} as { [id: number] : Storage; });
};

const testStorageData: Storage[] = [
    {
        id: 1,
        name: 'Storage 1',
        room: 'Room 1',
        shelf: 'Shelf 1'
    },
    {
        id: 2,
        name: 'Storage 2',
        room: 'Room 1',
        shelf: 'Shelf 2'
    }
];

export { getStorage };
export type { Storage };
