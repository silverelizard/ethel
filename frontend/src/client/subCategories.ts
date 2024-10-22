interface SubCategory {
    id: number;
    category_id: number;
    name: string;
}

const getSubCategories = async () => {
    let subCategories: SubCategory[] = [];
    try {
        const response = await fetch(`http://localhost:8000/sub_categories`);
        subCategories = await response.json();
    }
    catch(error) {
        console.log(error);
        subCategories = testSubCategoryData;
    }

    return subCategories.reduce((result, sub) => {
        result[sub.id] = sub;
        return result;
      }, {} as { [id: number] : SubCategory; });
};

const testSubCategoryData: SubCategory[] = [
    {
        id: 1,
        category_id: 1,
        name: 'Sub Category 1'
    },
    {
        id: 2,
        category_id: 1,
        name: 'Sub Category 2'
    },
    {
        id: 3,
        category_id: 1,
        name: 'Sub Category 3'
    },
    {
        id: 4,
        category_id: 1,
        name: 'Sub Category 4'
    },
    {
        id: 5,
        category_id: 2,
        name: 'Sub Category 5'
    }
];

export { getSubCategories };
export type { SubCategory };
