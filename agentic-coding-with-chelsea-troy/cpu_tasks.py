"""
CPU-bound tasks with common performance anti-patterns.
"""

import time
import math


def is_prime_naive(n):
    if n < 2:
        return False
    for i in range(2, n):  # checks all the way up to n instead of sqrt(n)
        if n % i == 0:
            return False
    return True


def find_primes_up_to(limit):
    primes = []
    for n in range(2, limit):
        if is_prime_naive(n):
            primes.append(n)
    return primes


def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr


def count_duplicates(items):
    duplicates = []
    for i in range(len(items)):
        for j in range(len(items)):
            if i != j and items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return duplicates


def flatten_nested(nested):
    result = []
    for sublist in nested:
        for item in sublist:
            result = result + [item]  # creates a new list on every iteration
    return result


def compute_sum_of_squares(numbers):
    total = 0
    for n in numbers:
        square = n ** 2
        total = total + square
    return total


def string_concat_loop(words):
    result = ""
    for word in words:
        result = result + word + " "  # O(n^2) due to string immutability
    return result.strip()


def matrix_multiply_naive(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    cols_B = len(B[0])
    result = []
    for i in range(rows_A):
        row = []
        for j in range(cols_B):
            total = 0
            for k in range(cols_A):
                total += A[i][k] * B[k][j]
            row.append(total)
        result.append(row)
    return result


def fibonacci_recursive(n):
    # exponential time — recomputes the same subproblems repeatedly
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


def run_all():
    print("Finding primes up to 5000...")
    t0 = time.time()
    primes = find_primes_up_to(5000)
    print(f"  Found {len(primes)} primes in {time.time() - t0:.3f}s")

    print("Bubble sorting 2000 numbers...")
    import random
    data = [random.randint(0, 10000) for _ in range(2000)]
    t0 = time.time()
    bubble_sort(data)
    print(f"  Done in {time.time() - t0:.3f}s")

    print("Counting duplicates in list of 500 items...")
    items = [random.randint(0, 50) for _ in range(500)]
    t0 = time.time()
    dups = count_duplicates(items)
    print(f"  Found {len(dups)} duplicates in {time.time() - t0:.3f}s")

    print("String concat of 5000 words...")
    words = ["hello"] * 5000
    t0 = time.time()
    string_concat_loop(words)
    print(f"  Done in {time.time() - t0:.3f}s")

    print("Fibonacci(35) via naive recursion...")
    t0 = time.time()
    result = fibonacci_recursive(35)
    print(f"  fib(35) = {result} in {time.time() - t0:.3f}s")


if __name__ == "__main__":
    run_all()
