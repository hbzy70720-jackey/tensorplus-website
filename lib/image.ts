/** 图片格式候选列表（按优先级：体积更小的现代格式在前） */
export const IMAGE_FORMATS = [".webp", ".png", ".jpg", ".jpeg", ".avif", ".gif", ".svg"];

const HAS_EXT_RE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

/** 判断路径是否已带图片扩展名 */
export function hasImageExtension(src: string): boolean {
  return HAS_EXT_RE.test(src);
}

/**
 * 根据基础路径生成候选图片地址。
 * - 已带扩展名：直接返回原路径（数据库里的上传图走这里）
 * - 不带扩展名：按优先级依次尝试各格式，第一个能加载的即为最终图片
 */
export function imageCandidates(src: string): string[] {
  if (!src) return [];
  if (hasImageExtension(src)) return [src];
  return IMAGE_FORMATS.map((ext) => src + ext);
}
