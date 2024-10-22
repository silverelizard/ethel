interface Category {
    id: number;
    name: string;
}

const getCategories = async () => {
    let categories: Category[] = [];
    try {
        const response = await fetch(`http://localhost:8000/categories`);
        categories = await response.json();
    }
    catch(error) {
        console.log(error);
        categories = testCategoryData;
    }

    return categories.reduce((result, cat) => {
        result[cat.id] = cat;
        return result;
      }, {} as { [id: number] : Category; });
};

const testCategoryData: Category[] = [
    {
        id: 1,
        name: 'Category 1'
    },
    {
        id: 2,
        name: 'Category 2'
    }
];

export { getCategories };
export type { Category };
