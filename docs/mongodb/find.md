# Find

## findOne

Net zoals we een select kunnen doen op een relationele database, gebruiken we find and findOne om onze objecten terug op te roepen.

findOne geeft ons 1 element terug, nl. het eerste element dat matcht met de query:

```typescript
let result: Pokemon | null = await client.db("Les").collection("pokemon").findOne<Pokemon>({});
console.log(result);
```

Merk op dat we als parameter &#123;&#125; meegeven. Dit komt overeen met een lege "where" clause in relationele database termen. Wanneer we bepaalde velden willen matchen, moeten we een object meegeven. Dit object bevat properties. Deze properties komen overeen met de namen van de properties van het object waar je naar zoekt:

```typescript
let result: Pokemon | null = await client.db("Les").collection("pokemon").findOne<Pokemon>({name:"eevee"});
console.log(result);
```

Pokemon objecten hebben de property name. Hierboven zoeken we dus alle Pokemon met "name" gelijk aan "eevee".

Je kan ook een ObjectId gebruiken om te zoeken naar een specifiek object:

```typescript
let result: Pokemon | null = await client.db("Les").collection("pokemon").findOne<Pokemon>({_id: new ObjectId("5f3b3b3b3b3b3b3b3b3b3b3b")});
console.log(result);
```

Je moet hier uiteraard ook de ObjectId importeren:

```typescript
import { MongoClient, ObjectId } from "mongodb";
```

## find

Wanneer we meerdere objecten willen ophalen, gebruiken we find:

```typescript
let cursor =  client.db("Les").collection("pokemon").find<Pokemon>({});
let result = await cursor.toArray();
console.log(result);
```

:::info
Let op: find geeft niet direct een resultaat terug, maar een cursor. Je kan dit cursor object gebruiken om de resultaten op te halen, door bv. toArray() te gebruiken (deze geeft een promise terug!).
:::

Als we dit allemaal bij elkaar zetten, krijgen we volgende code:

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

        let cursor =  client.db("Les").collection("pokemon").find<Pokemon>({});
        let pokemons = await cursor.toArray();
        console.log(pokemons);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
```
