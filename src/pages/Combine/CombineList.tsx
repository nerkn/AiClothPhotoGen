import { useState } from 'react';
import { useJobCombineStore } from '../../store/jobCombineStore';
import { Button } from '../../components/common'; 
import { navigate } from 'wouter/use-browser-location';
import CombineResults from './CombineResults';

export function CombineList() {
  const [selectedJobCombine, setSelectedJobCombine] = useState(0);
  const { jobCombines } = useJobCombineStore();
  
  if (selectedJobCombine) 
    return <CombineResults id={String(selectedJobCombine)} onClose={()=>setSelectedJobCombine(0) } />;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center"><div>
        <h2 className="text-xl font-semibold text-gray-800">Job Combines</h2>
        <p className="mt-1 text-sm text-gray-500">Manage and view all your job combinations</p>
      </div>
        <Button variant="primary" className="mt-4" onClick={()=>navigate('/CombineCreate')} >
          Create New Job Combine
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobCombines.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                  No job combines found
                </td>
              </tr>
            ) : (
              jobCombines.map((combine) => (
                <tr key={combine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{combine.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{combine.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{combine.desc}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      combine.status === 'processing' ? 'bg-green-100 text-green-800' : 
                      combine.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      combine.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {combine.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="primary" onClick={() =>setSelectedJobCombine(combine.id)}>
                      Detay
                    </Button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}