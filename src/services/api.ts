import { Book, ReadingList, Review, BookRecommendation } from '@/types';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Always returns a valid headers object.
 * Authorization is added only if a token exists.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Not logged in (or Amplify not configured). Keep Content-Type only.
  }

  return headers;
}

/**
 * BOOKS
 */
export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
}

export async function getBook(id: string): Promise<Book | null> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');
  return response.json();
}

export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers,
    body: JSON.stringify(book),
  });

  if (!response.ok) throw new Error('Failed to create book');
  return response.json();
}

export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(book),
  });

  if (!response.ok) throw new Error('Failed to update book');
  return response.json();
}

export async function deleteBook(id: string): Promise<void> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) throw new Error('Failed to delete book');
}

/**
 * RECOMMENDATIONS
 */
export async function getRecommendations(query: string): Promise<BookRecommendation[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) throw new Error('Failed to get recommendations');

  const data = await response.json();
  // Expecting: { recommendations: BookRecommendation[] }
  return data.recommendations ?? [];
}

/**
 * READING LISTS
 */
export async function getReadingLists(): Promise<ReadingList[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists`, { headers });

  if (!response.ok) throw new Error('Failed to fetch reading lists');
  return response.json();
}

export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists`, {
    method: 'POST',
    headers,
    body: JSON.stringify(list),
  });

  if (!response.ok) throw new Error('Failed to create reading list');
  return response.json();
}

export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(list),
  });

  if (!response.ok) {
    const data = await response.json();
    alert(`Server says: ${data.message}`);
    throw new Error('Failed to delete reading list');
  }
  return response.json();
}

export async function deleteReadingList(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();

  console.log(headers);

  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) throw new Error('Failed to delete reading list');

  return true;
}

/**
 * REVIEWS
 */
export async function getReviews(bookId: string): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`);

  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${review.bookId}/reviews`, {
    method: 'POST',
    headers,
    body: JSON.stringify(review),
  });

  if (!response.ok) throw new Error('Failed to create review');
  return response.json();
}
