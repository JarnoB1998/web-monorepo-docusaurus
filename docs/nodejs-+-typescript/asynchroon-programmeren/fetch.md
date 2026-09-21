# Fetch

Net zoals in de browser is het mogelijk om in Node.js een HTTP request te doen naar een andere server. Dit doe je met de `fetch` functie. Deze functie heeft als argument een URL. De functie geeft een Promise terug die een Response object bevat. Dit object bevat de data die je terugkrijgt van de server. In TypeScript is het wel belangrijk dat je het type van de data opgeeft die je verwacht terug te krijgen. Je moet dus een interface voorzien die de data beschrijft. 

De syntax is grotendeels hetzelfde als in JavaScript. Het enige verschil is dat je het type van de data moet opgeven. 

## Interface

We gaan in dit voorbeeld gebruik maken van de [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API. Deze API bevat een aantal endpoints die je kan gebruiken om data op te halen. We gaan in dit voorbeeld gebruik maken van de `/posts` endpoint. Deze endpoint geeft een lijst van posts terug.

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  ...
  {
    "userId": 10,
    "id": 100,
    "title": "at nam consequatur ea labore ea harum",
    "body": "cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut"
  }
]
```

Het eerste wat je moet doen is een interface maken die de data beschrijft die je verwacht terug te krijgen. In dit geval is dit een array van objecten. Elk object heeft een userId, id, title en body property. De userId en id property zijn van het type number. De title en body property zijn van het type string. 

```typescript
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
```

Je kan deze interface zelf maken, maar je kan ook gebruik maken van een tool zoals [QuickType](https://app.quicktype.io/) om deze automatisch te genereren. Zorg vooral dat de interface correct is en overeenkomt met de data die je verwacht terug te krijgen.

### Fetch

Nu kunnen we de fetch functie gebruiken om de data op te halen. We geven als argument de URL van de endpoint mee. Omdat de fetch functie een Promise teruggeeft, kunnen we de then functie gebruiken om de data te gebruiken. Omdat over het algemeen de data die je terugkrijgt van een server een JSON object is, moeten we de data eerst omzetten naar een JavaScript object. Dit doen we met de `json` functie. Deze functie geeft ook een Promise terug. We kunnen dus de then functie gebruiken om de data te gebruiken. 

Stel dat we de titel van de eerste post willen loggen naar de console. We kunnen dit doen met de volgende code:

```typescript
fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((response: Post[]) => {
        console.log(response[0].title);
    }).catch((error) => {
        console.log(error);
    });
```

of met async en await:

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts : Post[] = await response.json();
        console.log(posts[0].title);
    } catch (error: any) {
        console.log(error);
    }
})();
```

Let op dat een API niet altijd een array teruggeeft. Het kan ook een object zijn dat op zijn beurt weer een array bevat. Je moet dus altijd controleren wat de data is die je terugkrijgt. 

## Error afhandelen

De catch functie is nodig om een error af te handelen. Onder een errors vallen alleen errors die veroorzaakt worden op netwerk niveau. Dus bijvoorbeeld als de server niet bereikbaar is of als de URL niet bestaat. 

Als je toch een error wil afhandelen die veroorzaakt wordt door een fout in de code van de server, dan moet je de status code van de response controleren. Als de status code 2xx is, dan is er geen error. Als de status code iets anders is, dan is er een error.

```typescript
fetch('https://jsonplaceholder.typicode.com/posts/123')
    .then(r => {
        if (!r.ok) throw new Error(r.status.toString());
        return r.json()
    })
    .then(r => console.log(r))
    .catch(e => console.log(e));
```

We kijken hier na of de status code niet 2xx is aan de hand van de `ok` property. Deze property is `true` als de status code 2xx is. Als de status code niet 2xx is, dan gooien we een error.

Deze code is ook weer sterk te vereenvoudigen met async en await:

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/123');
        if (!response.ok) throw new Error(response.status.toString());
        const post: Post = await response.json();
        console.log(post.title);
    } catch (error: any) {
        console.log(error);
    }
})();
```

Je kan ook de `status` property gebruiken om de status code op te vragen. Deze property bevat een nummer. 

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/123');
        
        if (response.status === 404) throw new Error('Not found');
        if (response.status === 500) throw new Error('Internal server error');

        const post: Post = await response.json();
        console.log(post.title);
    } catch (error: any) {
        console.log(error);
    }
})();
```

## Testen

Om fetch-aanroepen te testen gebruiken we **Vitest**, zoals in het hoofdstuk [Testing](../testing.md). Omdat fetch asynchroon werkt én afhankelijk is van een externe server, combineren we twee technieken: async/await testen en mocking met **@fetch-mock/vitest**.

Installeer de testpackages in je Node.js-project:

```bash
npm i --save-dev vitest @fetch-mock/vitest
```

Een project dat je met `create-clean-node` maakt, bevat al Vitest en een `test`-script. Behoud dat script: het controleert eerst de TypeScript-types en voert daarna de tests één keer uit. In een ander project kan je het `test`-script uit het hoofdstuk Testing gebruiken.

### Exporteerbare functies

Om code te kunnen testen, moet je die eerst exporteren. Zet je fetch-logica daarom in een aparte module, bijvoorbeeld `post-service.ts`:

```typescript
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export async function getPosts(): Promise<Post[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error(response.status.toString());
    return response.json();
}

export async function getPost(id: number): Promise<Post> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) throw new Error(response.status.toString());
    return response.json();
}
```

### Asynchrone tests

Omdat fetch asynchroon werkt, gebruik je `async` en `await` in je tests. Dit eerste voorbeeld in `post-service.integration.test.ts` spreekt de echte API aan en heeft dus een internetverbinding nodig:

```typescript
import { describe, expect, it } from 'vitest';
import { getPost } from './post-service.ts';

describe("getPost", () => {
    it("should return a post by id", async () => {
        const post = await getPost(1);
        expect(post.id).toBe(1);
    });

    it("should throw an error when the post is not found", async () => {
        await expect(getPost(99999)).rejects.toThrow("404");
    });
});
```

Met `await expect(...).rejects.toThrow("404")` controleer je dat de Promise wordt afgewezen met de verwachte fout. De test faalt ook als de functie onverwacht slaagt. Bij alleen een `try/catch` met controles in de `catch` zou de test dan ten onrechte slagen. Gebruik ook hier `await`, zodat Vitest wacht tot de controle klaar is.

Je kan dit voorbeeld afzonderlijk uitvoeren met:

```bash
npm test -- post-service.integration.test.ts
```

### Fetch mocken

Voor unit tests willen we niet afhankelijk zijn van echte netwerkaanroepen. Dit kan leiden tot:

- **Flaky tests**: de test faalt bij een netwerkstoring, ook al is je code correct.
- **API-limieten**: externe services kunnen rate limits opleggen.
- **Trage tests**: netwerkaanroepen vertragen de testsuite.

Met [@fetch-mock/vitest](https://www.wheresrhys.co.uk/fetch-mock/docs/wrappers/vitest/) vervang je de echte `fetch` door een nep-versie die vooraf vastgelegde data teruggeeft. Zet het volgende voorbeeld in `post-service.test.ts`, naast `post-service.ts`:

```typescript
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { getPosts, getPost } from './post-service.ts';

beforeEach(() => {
    fetchMock.mockGlobal();
});

afterEach(() => {
    fetchMock.mockRestore();
});

describe("getPosts", () => {
    it("should return a list of posts", async () => {
        const mockPosts = [
            { userId: 1, id: 1, title: "foo", body: "bar" },
            { userId: 1, id: 2, title: "baz", body: "qux" },
        ];
        fetchMock.get('https://jsonplaceholder.typicode.com/posts', mockPosts);

        const posts = await getPosts();
        expect(posts).toHaveLength(2);
        expect(posts[0].title).toBe("foo");
        expect(posts).toEqual(mockPosts);
        expect(fetchMock).toHaveFetchedTimes(1, 'https://jsonplaceholder.typicode.com/posts');
    });
});

describe("getPost", () => {
    it("should return a post by id", async () => {
        const mockPost = { userId: 1, id: 1, title: "foo", body: "bar" };
        fetchMock.get('https://jsonplaceholder.typicode.com/posts/1', mockPost);

        const post = await getPost(1);
        expect(post).toEqual(mockPost);
        expect(fetchMock).toHaveFetchedTimes(1, 'https://jsonplaceholder.typicode.com/posts/1');
    });

    it("should throw an error when the server returns 404", async () => {
        fetchMock.get('https://jsonplaceholder.typicode.com/posts/999', 404);

        await expect(getPost(999)).rejects.toThrow("404");
    });

    it("should throw an error when the server returns 500", async () => {
        fetchMock.get('https://jsonplaceholder.typicode.com/posts/1', 500);

        await expect(getPost(1)).rejects.toThrow("500");
    });

    it("should reject when the network request fails", async () => {
        fetchMock.get('https://jsonplaceholder.typicode.com/posts/1', {
            throws: new TypeError("Failed to fetch"),
        });

        await expect(getPost(1)).rejects.toThrow("Failed to fetch");
    });
});
```

`beforeEach` vervangt de globale `fetch` vóór elke test. `fetchMock.get()` registreert alleen welk antwoord een GET-aanroep moet krijgen; je hebt dus ook `mockGlobal()` nodig. Een array of object wordt als JSON teruggegeven, een getal stelt een HTTP-statuscode voor en `throws` simuleert een netwerkfout. Een HTTP-fout wordt pas een afgewezen Promise doordat onze service `response.ok` controleert.

`afterEach` roept `mockRestore()` aan om de routes en aanroepgeschiedenis te wissen en de oorspronkelijke `fetch` te herstellen. Zo blijven de tests onafhankelijk, ook wanneer ze dezelfde URL gebruiken. De extra matcher `toHaveFetchedTimes` komt uit `@fetch-mock/vitest` en controleert hoe vaak de opgegeven URL werd opgevraagd.

Voer alleen de tests met mocks uit met:

```bash
npm test -- post-service.test.ts
```

Deze tests hebben geen internetverbinding nodig. Met `npm test` voer je alle testbestanden uit, dus ook het voorbeeld met de echte API als je dat bewaard hebt. Zonder dat integratietestbestand blijven je tests volledig lokaal.

## Interactieve demo

Probeer hieronder het verschil tussen een test **met** en **zonder** fetch mock. Gebruik de knoppen om te wisselen, of pas de code zelf aan.

- **Met mock** — `fetchMock.mockGlobal()` activeert de mock en `fetchMock.get()` registreert de antwoorden. De request gaat nooit het internet op: je ontvangt altijd de data die jij zelf instelt. De test slaagt.
- **Zonder mock** — de echte fetch gaat naar `jsonplaceholder.typicode.com`. De echte API geeft 100 posts terug met andere titels, waardoor de assertions falen.

De demo simuleert de testfuncties en fetch-mocks in de browser. In je Node.js-project gebruik je de volledige Vitest-tests met imports en hooks hierboven.

import InteractiveFetchMock from '@site/src/components/InteractiveFetchMock';

<InteractiveFetchMock />
