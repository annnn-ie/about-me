import React from 'react';

export function Tabs({ selectedKey, onSelectionChange, children, className = '' }) {
  return (
    <div className={`tabs ${className}`}>
      {children}
    </div>
  );
}

Tabs.List = function TabsList({ type = 'underline', items, children }) {
  return (
    <div className={`tabs-list tabs-list-${type}`}>
      {items.map((item) => (
        <div key={item.id} className="tabs-item">
          {children(item)}
        </div>
      ))}
    </div>
  );
};

Tabs.Item = function TabsItem({ id, label, isSelected, onPress }) {
  return (
    <button
      className={`tabs-trigger ${isSelected ? 'tabs-trigger-selected' : ''}`}
      onClick={() => onPress?.(id)}
      data-selected={isSelected}
    >
      {label}
    </button>
  );
};
