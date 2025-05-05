import Button from '../../components/common/Button';
import { MediaViewer } from '../../components/common/MediaViewer';
import { useItemsStore } from '../../store/itemsStore';
import { useJobCombineStore } from '../../store/jobCombineStore';

function CombineResults({id, onClose}: { id: string, onClose: () => void }) {
  const {  getJobCombineItemsByJobId } = useJobCombineStore();
  const {items} = useItemsStore();
  const jobCombineItems = getJobCombineItemsByJobId(Number(id));
  const itemFinder = (itemId: number) => {
    let i = items.find(item => item.id === itemId)
    if (i)
      return <img src={i.img ?? i.img2} alt={i.name} className="item-image h-24" />;
    return <></>
  };

  return (
    <div className="combine-results">
      <h1>Job Combine Items for Job ID: {id}</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>ID</th>
            <th>Head Items</th>
            <th>Top Items</th>
            <th>Bottom Items</th>
            <th>Shoe Items</th>
            <th>Bag Items</th>
            <th>Status</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {jobCombineItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{itemFinder(item.itemHead)}</td>
              <td>{itemFinder(item.itemTop)}</td>
              <td>{itemFinder(item.itemBottom)}</td>
              <td>{itemFinder(item.itemShoe)}</td>
              <td>{itemFinder(item.itemBag)}</td>
              <td>{item.status}</td>
              <td><MediaViewer url={item.output} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>  
            <td colSpan={7} className="text-right">
              <Button onClick={onClose} variant='secondary'>Kapa</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default CombineResults;