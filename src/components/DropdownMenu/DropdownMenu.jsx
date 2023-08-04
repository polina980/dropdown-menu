import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss';

const DropdownMenu = ({ trigger, content, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // Для хранения ссылки на элемент выпадающего меню
  const dropdownRef = useRef(null);
  // Для хранения ссылки на элемент триггера, который открывает выпадающее меню
  const triggerRef = useRef(null);

  // Функция для определения оптимальной позиции для отображения выпадающего меню
  const calculatePosition = () => {
    // Проверяем, что ссылки на DOM-элементы (triggerRef и dropdownRef) существуют
    if (triggerRef.current && dropdownRef.current) {
      // Получаем координаты (прямоугольник) триггера и выпадающего меню
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      // Получаем размеры окна браузера
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Вычисляем доступное пространство в разных направлениях

      // Свободное пространство снизу от триггера
      const spaceBelow = viewportHeight - triggerRect.bottom;

      // Свободное пространство сверху от триггера
      const spaceAbove = triggerRect.top;

      // Свободное пространство справа от триггера
      const spaceRight = viewportWidth - triggerRect.right;

      // Свободное пространство слева от триггера
      const spaceLeft = triggerRect.left;

      // Определяем, есть ли достаточно места сверху и справа
      const hasSpaceBelow = spaceBelow >= dropdownRect.height || spaceBelow >= spaceAbove;
      const hasSpaceRight = spaceRight >= dropdownRect.width || spaceRight >= spaceLeft;

      // Выбираем оптимальную позицию на основе доступного пространства

      // Если достаточно места сверху и справа, размещаем выпадающее меню снизу слева от триггера
      if (hasSpaceBelow && hasSpaceRight) {
        setPosition({ top: triggerRect.bottom, left: triggerRect.left });

        // Если достаточно места сверху, но справа места не хватает, размещаем снизу справа от триггера
      } else if (hasSpaceBelow && !hasSpaceRight) {
        setPosition({ top: triggerRect.bottom, left: triggerRect.right - dropdownRect.width });

        // Если сверху места не хватает, но справа достаточно, размещаем сверху слева от триггера
      } else if (!hasSpaceBelow && hasSpaceRight) {
        setPosition({ top: triggerRect.top - dropdownRect.height, left: triggerRect.left });

        // В остальных случаях, когда и сверху и справа места не хватает, размещаем сверху справа от триггера
      } else {
        setPosition({ top: triggerRect.top - dropdownRect.height, left: triggerRect.right - dropdownRect.width });
      }
    }
  };

  // Обработчик для закрытия меню при клике вне его области
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  // Обработчик для открытия/закрытия меню при клике на триггер
  const handleTriggerClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  // Обработчик для закрытия меню при клике на пункт меню,
  // gо условию клик внутри контента не должен закрывать дропдаун
  const handleMenuItemClick = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    calculatePosition();
    window.addEventListener('click', handleClickOutside);
    // Возвращаем функцию, которая удалит обработчик кликов при размонтировании компонента,
    // чтобы избежать утечек памяти и непредвиденных эффектов после размонтирования
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Пересчет позиции при изменении состояния isOpen
  useEffect(() => {
    calculatePosition();
  }, [isOpen]);

  return (
    <div>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        style={style}
      >
        {trigger}
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <div ref={dropdownRef} style={{ position: 'absolute', ...position }}>
            <div className={styles.dropdownMenu}>
              {content.map((item, index) => (
                <div key={index} onClick={handleMenuItemClick} className={styles.dropdownItem}>
                  {item.label}
                  <br />
                  {item.label2}
                  {item.icon}
                </div>
              ))}
            </div>
          </div>,
          document.getElementById('modal')
        )}
    </div>
  );
};

export default DropdownMenu;
