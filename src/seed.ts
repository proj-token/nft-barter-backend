import { populateAssetCollections } from './modules/collection/collection.service';
import { populateAssets } from './modules/asset/asset.service';
import { logger } from './modules/logger';

const seedData = async () => {
  logger.info(`Seeding data ...`);
  await populateAssetCollections();
  await populateAssets();
};

export default seedData;
