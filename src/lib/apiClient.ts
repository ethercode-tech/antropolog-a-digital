export async function apiFetch<T>(
    input: string,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(input, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      ...init,
    });
  
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `API_ERROR_${res.status}`);
    }
  
    return res.json();
  }
  