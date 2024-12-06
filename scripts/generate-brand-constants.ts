import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取 __dirname 的等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_MAP: Record<string, string> = {

};

function generateBrandConstants() {
  const brandDir = path.resolve(__dirname, '../src/assets/imgs/brand');
  const outputFile = path.resolve(__dirname, '../src/constants/brand.ts');

  // 读取品牌图片目录
  const files = fs.readdirSync(brandDir)
    .filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

  // 生成BRAND_LOGOS
  const brandLogos = files.reduce((acc, file) => {
    const brand = path.basename(file, path.extname(file));
    if (brand !== 'default') {
      acc[brand] = `/src/assets/imgs/brand/${file}`;
    }
    return acc;
  }, {} as Record<string, string>);

  // 生成BRAND_OPTIONS
  const brandOptions = Object.entries(brandLogos).map(([brand, logo]) => ({
    label: BRAND_MAP[brand] || brand,
    value: brand,
    logo
  }));

  // 生成常量文件内容
  const content = `
/** 默认品牌logo */
export const DEFAULT_BRAND_LOGO = '/src/assets/imgs/brand/default.png';

/** 品牌logo映射 */
export const BRAND_LOGOS: Record<string, string> = ${JSON.stringify(brandLogos, null, 2)};

/** 品牌选项 */
export const BRAND_OPTIONS = ${JSON.stringify(brandOptions, null, 2)};

/** 获取品牌logo */
export function getBrandLogo(brand: string) {
  return BRAND_LOGOS[brand] || DEFAULT_BRAND_LOGO;
}

/** 获取品牌中文名 */
export function getBrandLabel(brand: string) {
  return BRAND_OPTIONS.find(option => option.value === brand)?.label || brand;
}
`;

  // 写入文件
  fs.writeFileSync(outputFile, content);
  console.log('Brand constants generated successfully!');
}

generateBrandConstants(); 