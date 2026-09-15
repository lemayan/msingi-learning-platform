import fs from 'fs';

const assetMap = {
  "course.building-ai-apps-with-llms": {
    assetId: "image-e8e1e99b5f97cb8a9b3b2b22aea235d35d3bcea1-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/e8e1e99b5f97cb8a9b3b2b22aea235d35d3bcea1-1600x900.svg",
    alt: "Neural network nodes and large language model transformer architecture graphic"
  },
  "course.devops-with-docker-and-kubernetes": {
    assetId: "image-3b9fa82c226d7fd4b229e299ef44e50284a59542-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/3b9fa82c226d7fd4b229e299ef44e50284a59542-1600x900.svg",
    alt: "Docker containers, Kubernetes helm wheel, and cloud orchestration infrastructure graphic"
  },
  "course.nextjs-app-router-in-depth": {
    assetId: "image-dc6dfe49df0e83ec670e880d92a0e3f2c4d852e4-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/dc6dfe49df0e83ec670e880d92a0e3f2c4d852e4-1600x900.svg",
    alt: "Next.js App Router architecture and server client boundary graphic"
  },
  "course.postgresql-for-developers": {
    assetId: "image-787e10210ee25aed908b6db39505ae17478e2ee1-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/787e10210ee25aed908b6db39505ae17478e2ee1-1600x900.svg",
    alt: "PostgreSQL database tables, SQL queries, and relational indexing graphic"
  },
  "course.practical-web-security": {
    assetId: "image-24eb213c4725881087e8e4af7643ddee548cb81b-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/24eb213c4725881087e8e4af7643ddee548cb81b-1600x900.svg",
    alt: "Cybersecurity protection, cryptographic shield, and vulnerability defense graphic"
  },
  "course.python-for-data-work": {
    assetId: "image-8f60b7d5943641bd5b7592357f628f4346c62ff4-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/8f60b7d5943641bd5b7592357f628f4346c62ff4-1600x900.svg",
    alt: "Python for data analysis with pandas dataframes, charts, and statistics"
  },
  "course.react-performance-engineering": {
    assetId: "image-0a5adedfaae416523caf51e65ff188794bf016f7-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/0a5adedfaae416523caf51e65ff188794bf016f7-1600x900.svg",
    alt: "React performance profiling, speed gauge, and optimization graphic"
  },
  "course.retrieval-augmented-generation-from-scratch": {
    assetId: "image-67c4022705b8dcbeefd0ad5aa8367fda19084b63-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/67c4022705b8dcbeefd0ad5aa8367fda19084b63-1600x900.svg",
    alt: "Vector embeddings, multi-dimensional search space, and RAG knowledge retrieval pipeline"
  },
  "course.system-design-foundations": {
    assetId: "image-07c177dc52b18416b6bb80fe363c2fc861367947-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/07c177dc52b18416b6bb80fe363c2fc861367947-1600x900.svg",
    alt: "Distributed system design, microservices, load balancing, and caching topology graphic"
  },
  "course.typescript-for-application-developers": {
    assetId: "image-6dff19be66f12a27596b27da02462fe309d8d72f-1600x900-svg",
    url: "https://cdn.sanity.io/images/xyto8u3e/production/6dff19be66f12a27596b27da02462fe309d8d72f-1600x900.svg",
    alt: "TypeScript type safety, structural typing, and generic systems graphic"
  }
};

const filePath = 'studio/scripts/seeds/seed.ndjson';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
const updatedLines = lines.map(line => {
  if (!line.trim()) return line;
  try {
    const doc = JSON.parse(line);
    if (doc._type === 'course' && assetMap[doc._id]) {
      const mapping = assetMap[doc._id];
      doc.coverImage = {
        _type: 'image',
        _sanityAsset: `image@${mapping.url}`,
        alt: mapping.alt
      };
      return JSON.stringify(doc);
    }
    return line;
  } catch {
    return line;
  }
});

fs.writeFileSync(filePath, updatedLines.join('\n'));
console.log('Updated seed.ndjson with new topic-relevant image URLs');
