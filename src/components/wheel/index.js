import React from 'react';

import './index.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    const { items } = this.props;
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem({index: selectedItem, value: items[selectedItem]});
      }
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 2000);
    }
  }

  swivelWheel(selectedItem) {
    this.setState({ selectedItem });
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';

    return (
      <div className="wheel-container">
        <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem}>
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
