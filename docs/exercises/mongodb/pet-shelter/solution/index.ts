import { type Collection, MongoClient, type ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

interface Pet {
    _id?: ObjectId;
    name: string;
    age: number;
    type: string;
    breed: string;

}

const pets : Pet[] = [
    { name: "Buddy", age: 2, type: "dog", breed: "Golden Retriever" },
    { name: "Daisy", age: 3, type: "dog", breed: "Beagle" },
    { name: "Coco", age: 1, type: "dog", breed: "Poodle" },
    { name: "Charlie", age: 2, type: "cat", breed: "Siamese" },
    { name: "Luna", age: 3, type: "cat", breed: "Persian" },
    { name: "Lucy", age: 1, type: "cat", breed: "Maine Coon" },
    { name: "Max", age: 4, type: "dog", breed: "Labrador Retriever" },
    { name: "Bella", age: 2, type: "dog", breed: "French Bulldog" },
    { name: "Milo", age: 1, type: "dog", breed: "Border Collie" },
    { name: "Oliver", age: 3, type: "cat", breed: "Bengal" },
    { name: "Tiger", age: 2, type: "cat", breed: "Ragdoll" },
    { name: "Zoe", age: 3, type: "cat", breed: "Sphynx" },
    { name: "Sophie", age: 5, type: "dog", breed: "Dachshund" },
    { name: "Lily", age: 1, type: "cat", breed: "British Shorthair" },
    { name: "Oscar", age: 4, type: "dog", breed: "Boxer" },
    { name: "Ruby", age: 2, type: "dog", breed: "Siberian Husky" },
    { name: "Rosie", age: 2, type: "cat", breed: "Scottish Fold" },
    { name: "Jack", age: 3, type: "dog", breed: "Cocker Spaniel" },
    { name: "Sadie", age: 2, type: "dog", breed: "Rottweiler" },
    { name: "Maggie", age: 1, type: "dog", breed: "Shih Tzu" }
];



function prettyPrintPet(pet: Pet) {
    console.log(`${pet.name.padEnd(10)}${pet.type.padEnd(10)}${pet.breed.padEnd(20)}${pet.age.toString().padEnd(20)}`);
}

function prettyPrintPets(pet: Pet[]) {
    pet.forEach(prettyPrintPet);
}

async function main() {
    try {
        await client.connect();
        console.log("Connected to the database");

        let collection : Collection<Pet> = client.db("exercises").collection<Pet>("pet-shelter");

        // Delete all documents in the collection
        await collection.deleteMany({});

        // Insert all pets into the collection
        await collection.insertMany(pets);

        // Find all pets in the collection of the type "dog"
        console.log("All pets in the collection of the type 'dog': ");
        let dogs : Pet[] = await collection.find<Pet>({ type: "dog" }).toArray();
        prettyPrintPets(dogs);

        // Find all pets in the collection of the type "dog" or "cat" (with $in operator)
        console.log("All pets in the collection of the type 'dog' or 'cat': ");
        let dogsAndCats : Pet[] = await collection.find<Pet>({ type: { $in: ["dog", "cat"] } }).toArray();
        prettyPrintPets(dogsAndCats);

        // Find all pets in the collection of the type "dog" or "cat" (with $or operator)
        console.log("All pets in the collection of the type 'dog' or 'cat': ");
        let dogsAndCats2 : Pet[] = await collection.find<Pet>({ $or: [{ type: "dog" }, { type: "cat" }] }).toArray();
        prettyPrintPets(dogsAndCats2);

        // Find all pets in the collection that are between 2 and 4 years old (with $gte and $lte operators)
        console.log("All pets in the collection that are between 2 and 4 years old: ");
        let middleAgedPets : Pet[] = await collection.find<Pet>({$and: [{ age: { $gte: 2 } }, { age: { $lte: 4}}]}).toArray();
        prettyPrintPets(middleAgedPets);

        // Find all pets that have "Retriever" in their breed (with $text operator)
        console.log("All pets that have 'Retriever' in their breed: ");
        await collection.createIndex({ breed: "text" });
        let retrievers : Pet[] = await collection.find<Pet>({ $text: { $search: "Retriever" } }).toArray();
        prettyPrintPets(retrievers);

        // Sort the pets by age in ascending order
        console.log("All pets sorted by age in ascending order: ");
        let sortedPets : Pet[] = await collection.find<Pet>({}).sort({ age: 1 }).toArray();
        prettyPrintPets(sortedPets);

        // Sort the pets by alphabetically by name in descending order
        console.log("All pets sorted by name in descending order: ");
        let sortedPets2 : Pet[] = await collection.find<Pet>({}).sort({ name: -1 }).toArray();
        prettyPrintPets(sortedPets2);

        // Sort the pets by age in descending order and limit the result to 1 pet. It should be the oldest pet.
        console.log("The oldest pet in the collection: ");
        let oldestPet : Pet | null = await collection.find<Pet>({}).sort({ age: -1 }).limit(1).next();
        
        if (oldestPet) {
            prettyPrintPet(oldestPet);
        }

        // Sort the pets by age in ascending order, skip the first 5 pets and limit the result to 5 pets. It should be the 6th to 10th youngest pets.
        console.log("The 6th to 10th youngest pets in the collection: ");
        let youngestPets : Pet[] = await collection.find<Pet>({}).sort({ age: 1 }).skip(5).limit(5).toArray();
        prettyPrintPets(youngestPets);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main();

export {}