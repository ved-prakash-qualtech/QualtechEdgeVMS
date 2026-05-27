import fs from 'fs/promises';
import path from 'path';

export async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeJsonFile(filePath, data) {
  // Ensure target folder exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function appendJsonData(filePath, newItem) {
  const data = await readJsonFile(filePath);
  if (!Array.isArray(data)) {
    throw new Error('Target JSON is not an array');
  }
  data.push(newItem);
  await writeJsonFile(filePath, data);
  return newItem;
}

export async function updateJsonData(filePath, key, val, updatedFields) {
  const data = await readJsonFile(filePath);
  if (!Array.isArray(data)) {
    throw new Error('Target JSON is not an array');
  }
  
  let foundIndex = -1;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    // Check nested key if needed, or flat key
    if (item[key] === val) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    throw new Error(`Item with ${key} = ${val} not found`);
  }

  // Merge recursively or flatly
  data[foundIndex] = {
    ...data[foundIndex],
    ...updatedFields
  };

  await writeJsonFile(filePath, data);
  return data[foundIndex];
}

export async function deleteJsonData(filePath, key, val) {
  const data = await readJsonFile(filePath);
  if (!Array.isArray(data)) {
    throw new Error('Target JSON is not an array');
  }
  const filtered = data.filter(item => item[key] !== val);
  await writeJsonFile(filePath, filtered);
  return filtered;
}
