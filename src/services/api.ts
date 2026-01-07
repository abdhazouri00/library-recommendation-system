import { Book, ReadingList, Review, Recommendation } from '@/types';
import { fetchAuthSession } from 'aws-amplify/auth';

// started editing by mohanad

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    // ignore
  }

  return headers;
}

// Update getBooks function:
export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
}

// Update createReadingList function:
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

export async function getRecommendations(query: string): Promise<Recommendation[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error('Failed to get recommendations');
  const data = await response.json();
  return data.recommendations;
}


export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers,
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to create book');
  }

  return response.json();
}



export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to update book');
  }

  return response.json();
}


export async function deleteBook(id: string): Promise<void> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
}


export async function getReviews(bookId: string): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`);

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
}

export async function createReview(
  review: Omit<Review, 'id' | 'createdAt'>
): Promise<Review> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/books/${review.bookId}/reviews`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(review),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create review');
  }

  return response.json();
}


//end mohanad editing 




/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for all API calls.
 *
 * TO IMPLEMENT AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [ ] Week 1: Set up AWS account and first Lambda function
 * [ ] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [ ] Week 2: Deploy Lambda functions for Books API
 * [ ] Week 2: Deploy Lambda functions for Reading Lists API
 * [ ] Week 2: Set VITE_API_BASE_URL in .env file
 * [ ] Week 3: Set up Cognito User Pool
 * [ ] Week 3: Install aws-amplify: npm install aws-amplify
 * [ ] Week 3: Configure Amplify in src/main.tsx
 * [ ] Week 3: Update AuthContext with Cognito functions
 * [ ] Week 3: Implement getAuthHeaders() function below
 * [ ] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// TODO: Uncomment this after deploying API Gateway (Week 2, Day 4)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * TODO: Implement this function in Week 3, Day 4
 *
 * This function gets the JWT token from Cognito and adds it to API requests.
 *
 * Implementation:
 * 1. Import: import { fetchAuthSession } from 'aws-amplify/auth';
 * 2. Get session: const session = await fetchAuthSession();
 * 3. Extract token: const token = session.tokens?.idToken?.toString();
 * 4. Return headers with Authorization: Bearer {token}
 *
 * See IMPLEMENTATION_GUIDE.md - Week 3, Day 5-7 for complete code.
 */
// async function getAuthHeaders() {
//   try {
//     const session = await fetchAuthSession();
//     const token = session.tokens?.idToken?.toString();
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   } catch {
//     return {
//       'Content-Type': 'application/json'
//     };
//   }
// }

/**
 * Get all books from the catalog
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-books (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books
 * 3. Uncomment API_BASE_URL at top of file
 * 4. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books`);
 * if (!response.ok) throw new Error('Failed to fetch books');
 * return response.json();
 *
 * Expected response: Array of Book objects from DynamoDB
 */

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 *
 * Expected response: Single Book object or null if not found
 */
export async function getBook(id: string): Promise<Book | null> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');
  return response.json();
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-book
 * 2. Create API Gateway endpoint: POST /books
 * 3. Add Cognito authorizer (Week 3)
 * 4. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/books`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(book)
 * });
 * if (!response.ok) throw new Error('Failed to create book');
 * return response.json();
 *
 * Note: This endpoint requires admin role in Cognito
 */


/**
 * Update an existing book (admin only)
 * TODO: Replace with PUT /books/:id API call
 */


/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */


/**
 * Get AI-powered book recommendations using Amazon Bedrock
 *
 * TODO: Replace with real API call in Week 4, Day 1-2
 *
 * Implementation steps:
 * 1. Enable Bedrock model access in AWS Console (Claude 3 Haiku recommended)
 * 2. Deploy Lambda function: library-get-recommendations (see IMPLEMENTATION_GUIDE.md)
 * 3. Create API Gateway endpoint: POST /recommendations
 * 4. Add Cognito authorizer
 * 5. Update function signature to accept query parameter:
 *    export async function getRecommendations(query: string): Promise<Recommendation[]>
 * 6. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/recommendations`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify({ query })
 * });
 * if (!response.ok) throw new Error('Failed to get recommendations');
 * const data = await response.json();
 * return data.recommendations;
 *
 * Expected response: Array of recommendations with title, author, reason, confidence
 *
 * Documentation: https://docs.aws.amazon.com/bedrock/latest/userguide/
 */

/**
 * Get user's reading lists
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-reading-lists
 * 2. Lambda should query DynamoDB by userId (from Cognito token)
 * 3. Create API Gateway endpoint: GET /reading-lists
 * 4. Add Cognito authorizer (Week 3)
 * 5. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/reading-lists`, {
 *   headers
 * });
 * if (!response.ok) throw new Error('Failed to fetch reading lists');
 * return response.json();
 *
 * Expected response: Array of ReadingList objects for the authenticated user
 */
export async function getReadingLists(): Promise<ReadingList[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reading-lists`, { headers });
  if (!response.ok) throw new Error('Failed to fetch reading lists');
  return response.json();
}

/**
 * Create a new reading list
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-reading-list
 * 2. Lambda should generate UUID for id and timestamps
 * 3. Lambda should get userId from Cognito token
 * 4. Create API Gateway endpoint: POST /reading-lists
 * 5. Add Cognito authorizer (Week 3)
 * 6. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/reading-lists`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(list)
 * });
 * if (!response.ok) throw new Error('Failed to create reading list');
 * return response.json();
 *
 * Expected response: Complete ReadingList object with generated id and timestamps
 */

/**
 * Update a reading list
 * TODO: Replace with PUT /reading-lists/:id API call
 */
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
  if (!response.ok) throw new Error('Failed to update reading list');
  return response.json();
}

/**
 * Delete a reading list
 * TODO: Replace with DELETE /reading-lists/:id API call
 */
export async function deleteReadingList(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete reading list');
}

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */


/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
