export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
          
          {/* Main content skeleton */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              {/* Image skeleton */}
              <div className="md:w-1/2 p-6">
                <div className="h-96 w-full bg-gray-200 rounded"></div>
              </div>
              
              {/* Details skeleton */}
              <div className="md:w-1/2 p-8">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                
                <div className="space-y-2 mb-8">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-9/12"></div>
                </div>
                
                <div className="space-y-4 mt-8">
                  <div className="h-14 bg-gray-200 rounded w-full"></div>
                  <div className="h-14 bg-gray-100 rounded w-full"></div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 ml-4"></div>
                    </div>
                    <div className="flex">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 ml-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
