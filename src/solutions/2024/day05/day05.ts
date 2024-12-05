const mapInput = (input: string[]) => {
  const pageOrdereringRules = input.slice(0, input.indexOf(""));

  const pageStacks = input
    .slice(input.indexOf("") + 1)
    .map((line) => line.split(","));

  return { pageOrdereringRules, pageStacks };
};

const checkPagingOrder = (pageOrdereringRules: string[], pages: string[]) => {
  return pageOrdereringRules.every((rule) => {
    const [page1, page2] = rule.split("|");
    const indexBefore = pages.indexOf(page1);
    const indexAfter = pages.indexOf(page2);
    if (indexBefore === -1 || indexAfter === -1) {
      return true;
    }
    if (indexBefore > indexAfter) {
      return false;
    }
    return true;
  });
};

const getMiddleItem = (input: string[]) => input[Math.floor(input.length / 2)];

export const solveStar1 = (input: string[]) => {
  const { pageOrdereringRules, pageStacks } = mapInput(input);
  const correct = pageStacks.filter((stack) =>
    checkPagingOrder(pageOrdereringRules, stack)
  );

  return correct
    .map(getMiddleItem)
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0);
};

const orderItems = (pagingRules: string[], stack: string[]) => {
  const resultingStack = [];
  let relevantPagingRules = pagingRules.filter((rule) => {
    const [page1, page2] = rule.split("|");
    return stack.includes(page1) && stack.includes(page2);
  });

  while (relevantPagingRules.length > 0) {
    const pageOnlyOnLeftSide = relevantPagingRules
      .find((rule) => {
        const [page1] = rule.split("|");
        return relevantPagingRules.every((rule) => {
          const [, rulePage2] = rule.split("|");
          return page1 !== rulePage2;
        });
      })!
      .split("|")[0];

    resultingStack.push(pageOnlyOnLeftSide);

    relevantPagingRules = relevantPagingRules.filter((rule) => {
      const [page1, page2] = rule.split("|");
      return page1 !== pageOnlyOnLeftSide && page2 !== pageOnlyOnLeftSide;
    });
  }
  return resultingStack;
};
export const solveStar2 = (input: string[]) => {
  const { pageOrdereringRules, pageStacks } = mapInput(input);
  const incorrect = pageStacks.filter(
    (stack) => !checkPagingOrder(pageOrdereringRules, stack)
  );

  const orderedStacks = incorrect.map((stack) =>
    orderItems(pageOrdereringRules, stack)
  );

  return orderedStacks
    .map(getMiddleItem)
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0);
};
