import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getReadingLists, createReadingList, deleteReadingList } from '@/services/api';
import { Book, ReadingList } from '@/types';
import { formatDate } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling';
import { useAuth } from '@/hooks/useAuth';
import { getBooks, updateReadingList } from '@/services/api';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * ReadingLists page component
 */
export function ReadingLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const lists = await getBooks();

        setBooks(lists);
        console.log(lists);
      } catch (error) {
        console.error('Failed to load lists:', error);
      }
    };

    loadBooks();
  }, []);

  const handleViewList = (list: ReadingList) => {
    setSelectedList(list);
    setIsViewModalOpen(true);
  };

  const loadLists = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with DynamoDB query
      const data = await getReadingLists();
      setLists(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    if (!selectedList) return;

    const updatedBookIds = selectedList.bookIds.filter((id) => id !== bookId);

    try {
      const updatedList = await updateReadingList(selectedList.id, {
        name: selectedList.name,
        bookIds: updatedBookIds,
      });

      setSelectedList(updatedList);
      setLists(lists.map((l) => (l.id === updatedList.id ? updatedList : l)));

      showSuccess('Book removed from list');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      alert('Please enter a list name');
      return;
    }

    try {
      // TODO: Replace with DynamoDB put operation
      if (!user?.id) {
        throw new Error('User not loaded. Please re-login.');
      }
      const newList = await createReadingList({
        userId: user.id,
        name: newListName,
        description: newListDescription,
        bookIds: [],
      });
      setLists([...lists, newList]);
      setIsModalOpen(false);
      setNewListName('');
      setNewListDescription('');
      showSuccess('Reading list created successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteReadingListtoAPI = async (listId: string) => {
    if (!window.confirm('Delete this list?')) return;

    try {
      console.log(listId);
      await deleteReadingList(listId);

      setLists(lists.filter((l) => l.id !== listId));
      showSuccess('Deleted successfully');
    } catch (error) {
      handleApiError(error);
    }
  };

  const getBookName = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">My Reading Lists</h1>
            <p className="text-slate-600 text-lg">Organize your books into custom lists</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
            Create New List
          </Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <svg
              className="w-16 h-16 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No reading lists yet</h3>
            <p className="text-slate-600 mb-4">
              Create your first list to start organizing your books
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Create Your First List
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div
                key={list.id}
                onClick={() => handleViewList(list)}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">{list.name}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">{list.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{list.bookIds.length} books</span>
                  <span>Created {formatDate(list.createdAt)}</span>
                  <button className="text-red-600" onClick={() => deleteReadingListtoAPI(list.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Reading List"
        >
          <div>
            <Input
              label="List Name"
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Summer Reading 2024"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="What's this list about?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleCreateList} className="flex-1">
                Create List
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedList?.name || 'Reading List'}
      >
        <div className="space-y-4">
          <p className="text-slate-600 mb-4">{selectedList?.description}</p>
          <h4 className="font-bold text-slate-900 border-b pb-2">Books in this list:</h4>

          {selectedList?.bookIds && selectedList.bookIds.length > 0 ? (
            <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {selectedList.bookIds.map((bookId, index) => {
                // ✅ Find the full book object from your 'books' array
                const bookDetails = books.find((b) => b.id === bookId);

                return (
                  <li key={index} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {bookDetails?.coverImage && (
                        <img
                          src={bookDetails.coverImage}
                          className="w-8 h-10 object-cover rounded shadow-sm"
                          alt=""
                        />
                      )}
                      <div>
                        <p className="text-slate-900 font-semibold">
                          {bookDetails ? bookDetails.title : `ID: ${bookId}`}
                        </p>
                        {bookDetails && (
                          <p className="text-xs text-slate-500">by {bookDetails.author}</p>
                        )}
                      </div>
                    </div>

                    {/* ✅ Delete Button */}
                    <button
                      onClick={() => handleRemoveBook(bookId)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors p-2"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500 italic py-4">This list is empty.</p>
          )}

          <Button
            variant="secondary"
            onClick={() => setIsViewModalOpen(false)}
            className="w-full mt-4"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
