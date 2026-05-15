# Performance Optimization: Mirror Testing

## Optimization: Concurrent Mirror Testing

### Issue

The mirror testing process in `MirrorService.testAllMirrors()` was implemented sequentially. Each mirror was tested one by one, waiting for the previous one to complete before starting the next.

### Rationale

Testing a mirror involves spawning an external `rclone` process to check connectivity. This is an I/O-bound operation that spends most of its time waiting for network responses. Running these tests sequentially is inefficient, especially as the number of mirrors grows.

By running tests concurrently, we can utilize the system's ability to handle multiple network requests simultaneously, drastically reducing the total time required to test all mirrors.

### Theoretical Baseline and Improvement

Let:

- $N$ = Number of mirrors
- $T$ = Average time to test one mirror (mostly network latency)
- $L$ = Concurrency limit (to avoid overwhelming the system)

**Sequential Execution Time (Baseline):**
$Time_{seq} = N \times T$

**Concurrent Execution Time (Optimized):**
$Time_{concurrent} = \lceil N/L \rceil \times T + \text{overhead}$

**Example:**
If $N = 10$, $T = 1.5s$, and $L = 3$:

- $Time_{seq} = 10 \times 1.5 = 15s$
- $Time_{concurrent} = \lceil 10/3 \rceil \times 1.5 = 4 \times 1.5 = 6s$
- **Theoretical Speedup:** ~2.5x faster

### Safety Considerations

To ensure the optimization is safe:

1. **Concurrency Limit:** A limit of 3 concurrent tests is implemented to avoid overwhelming the network or local process management.
2. **Race Condition Prevention:** The `saveMirrors` method is refactored to use a promise chain (sequential queue) to ensure that concurrent updates to the mirror metadata file do not result in race conditions or file corruption.
