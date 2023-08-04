import DropdownMenu from '../DropdownMenu/DropdownMenu';
import { menuContent } from '../../utils/content';
import FeatherIcon from 'feather-icons-react';
import './styles.module.scss';

const positions = [
  { position: 'absolute', top: 0, left: 0 },
  { position: 'absolute', top: 0, right: 0 },
  { position: 'absolute', bottom: 0, left: 0 },
  { position: 'absolute', bottom: 0, right: 0 },
];

const App = () => {
  return (
    <main>
      {positions.map((position, index) => (
        <DropdownMenu
          key={index}
          trigger={
            <button>
              <FeatherIcon icon="more-vertical" strokeWidth="2.5" />
            </button>
          }
          content={menuContent}
          style={position}
        />
      ))}
    </main>
  );
};

export default App;
