export const leastCommonMultiple = (arr: number[]) =>
  arr.reduce(
    (acc, curr) => (acc * curr) / greatestCommonDivisor([acc, curr]),
    1
  );

export const greatestCommonDivisor = (arr: number[]): number =>
  arr.reduce((a, b) => (b === 0 ? a : greatestCommonDivisor([b, a % b])), 1);

export const isPrime = (num: number) => {
  if (num <= 3) return num > 1;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let count = 5;
  while (Math.pow(count, 2) <= num) {
    if (num % count === 0 || num % (count + 2) === 0) return false;
    count += 6;
  }
  return true;
};

export const getPrimes = (max: number) => {
  const primes = [];
  for (let i = 2; i < max; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
};

export const getPrimeFactors = (num: number) => {
  const primes = getPrimes(num);
  const factors = [];
  for (let i = 0; i < primes.length; i++) {
    if (num % primes[i] === 0) factors.push(primes[i]);
  }
  return factors;
};

export const getDivisors = (num: number) => {
  const divisors = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) divisors.push(i);
  }
  return divisors;
};
