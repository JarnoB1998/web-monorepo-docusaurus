# Insert

## insertOne

Voor het toevoegen van 1 element gebruiken we de functie `insertOne`. Door een object mee te geven als parameter wordt dit object toegevoegd aan de database:

```typescript
import { MongoClient, type ObjectId } from "mongodb";

const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

interface Pokemon {
    _id?: ObjectId,
    name: string,
    age: number
}

async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        let pikachu: Pokemon = { name:"pikachu", age:12 };
        const result = await client.db("Les").collection("pokemon").insertOne(pikachu);
        console.log(`New document created with the following id: ${result.insertedId}`);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main();
```

Aan de hand van de `db` en `collection` functies kunnen we de database en collectie selecteren waar we willen toevoegen. In dit geval voegen we een Pokemon object toe aan de collectie "pokemon".

:::info
Let op: elk object krijgt automatisch een \_id wanneer die wordt toegevoegd aan de database. MongoDB kiest hier zelf een uniek id. Om later deze property te kunnen aanspreken, hebben we dit veld voorzien in de interface van Pokemon. We maken die echter optioneel zodat we die zelf geen waarde geven.
:::

## insertMany

Wanneer we verschillende elementen willen toevoegen, gebruiken we `insertMany`. Stel dat we een array van Pokemon objecten hebben:

```typescript
const pokemon: Pokemon[] = [
  {name: "pichu", age:7},
  {name: "flareon",age:3}
];
```

dan kunnen we deze allemaal tegelijk toevoegen:

```typescript
const result = await client.db("Les").collection("pokemon").insertMany(pokemon);
console.log(`${result.insertedCount} new documents(s) created with the following id(s):`);
console.log(result.insertedIds);
```

MongoDB laat toe verschillende types in 1 collectie toe te voegen. Stel dat we een array van objecten hebben met verschillende properties:

```typescript
const pokemon: any[] = [
    {name: "pichu", age:7},
    {trainer: "ash"}
];
```

dan kunnen we deze toevoegen in 1 collectie:

```typescript
let result = await client.db("Les").collection("pokemon").insertMany(pokemon);
console.log(`${result.insertedCount} new documents(s) created with the following id(s):`);
console.log(result.insertedIds);
```

Alhoewel dit mogelijk is, is dit niet altijd een goed idee. Het is beter om een duidelijke structuur te hebben in je collecties. Dit maakt het makkelijker om queries uit te voeren. Maar het is wel een van de voordelen van NoSQL databases.
