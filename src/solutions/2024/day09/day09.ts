import { last } from "../../../utils/helpers";

interface Block {
  id?: number;
  index: number;
}

interface BlockWithSize extends Block {
  size: number;
}

export const parseDiskMapToBlock = (diskMap: string): Block[] => {
  return diskMap.split("").flatMap((curr, index) => {
    const length = Number(curr);
    const isFreeSpace = index % 2 === 1;
    const blocks: Block[] = Array.from({ length }).map((_, i) => ({
      id: isFreeSpace ? undefined : Math.floor(index / 2),
      index,
    }));
    return blocks;
  }, []);
};

export const allocate = (blocks: Block[]) => {
  const firstFreeSpaceBlock = blocks.findIndex(
    (block) => block.id === undefined
  );
  const lastFreeSpaceBlock = blocks[blocks.length - 1].index
    ? blocks.length
    : blocks.length -
      1 -
      blocks.reverse().findIndex((block) => block.id !== undefined);

  const firstId = blocks[firstFreeSpaceBlock].id;
  const lastId = blocks[lastFreeSpaceBlock - 1].id;
  blocks[firstFreeSpaceBlock].id = lastId;
  blocks[lastFreeSpaceBlock - 1].id = firstId;
  return blocks.slice(0, lastFreeSpaceBlock - 1);
};

const checkSum = (blocks: Block[]) => {
  return blocks.reduce((acc, curr, index) => {
    return acc + (curr.id ? Number(curr.id) * index : 0);
  }, 0);
};

export const solveStar1 = (input: string[]) => {
  let blocks = parseDiskMapToBlock(input[0]);
  while (blocks.some((block) => block.id === undefined)) {
    blocks = allocate(blocks);
  }
  return checkSum(blocks);
};

export const parseBlocksWithSize = (diskMap: string): BlockWithSize[] => {
  return diskMap.split("").map((curr, index) => {
    const length = Number(curr);
    const isFreeSpace = index % 2 === 1;
    return {
      id: isFreeSpace ? undefined : Math.floor(index / 2),
      index,
      size: length,
    };
  }, []);
};

const allocateWithSize = (
  blocks: BlockWithSize[],
  minSize: number
): { blocks: BlockWithSize[]; newMinSize: number } => {
  const firstFreeSpaceBlock = blocks.find(
    (block) => block.id === undefined && block.size >= minSize
  );
  if (!firstFreeSpaceBlock) {
    return { blocks, newMinSize: minSize + 1 };
  }
  const lastNumberBlockWithLessSize = blocks
    .reverse()
    .find(
      (block) =>
        block.id !== undefined && block.size <= firstFreeSpaceBlock.size
    );

  blocks.reverse();

  if (!lastNumberBlockWithLessSize) {
    return { blocks, newMinSize: minSize + 1 };
  }

  const firstIndex = blocks.indexOf(firstFreeSpaceBlock);
  const lastIndex = blocks.indexOf(lastNumberBlockWithLessSize);

  if (firstIndex > lastIndex) {
    return { blocks, newMinSize: minSize + 1 };
  }

  const restFreeSpaceLength =
    firstFreeSpaceBlock.size - lastNumberBlockWithLessSize.size;

  firstFreeSpaceBlock.id = lastNumberBlockWithLessSize.id;
  firstFreeSpaceBlock.size = lastNumberBlockWithLessSize.size;
  lastNumberBlockWithLessSize.id = undefined;

  if (restFreeSpaceLength > 0) {
    const restFreeSpaceBlock: BlockWithSize = {
      id: undefined,
      index: firstIndex + lastNumberBlockWithLessSize.size,
      size: restFreeSpaceLength,
    };
    blocks = [
      ...blocks.slice(0, firstIndex + 1),
      restFreeSpaceBlock,
      ...blocks.slice(firstIndex + 1),
    ];
  }

  return { blocks, newMinSize: minSize };
};

const flattenBlocksWithSize = (blocks: BlockWithSize[]): Block[] => {
  return blocks.flatMap((b) => Array.from({ length: b.size }, () => b));
};

export const solveStar2 = (input: string[]) => {
  let blocks = parseBlocksWithSize(input[0]);
  let minSize = 1;

  while (minSize < 10) {
    const newAlloc = allocateWithSize(blocks, minSize);
    blocks = newAlloc.blocks;
    minSize = newAlloc.newMinSize;
  }

  const flattenedBlocks = flattenBlocksWithSize(blocks);
  return checkSum(flattenedBlocks);
};
