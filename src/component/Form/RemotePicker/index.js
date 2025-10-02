import React from 'react'
import { ActivityIndicator, Alert, Text, View, FlatList, SafeAreaView, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'
import axios from 'axios'

import styles from './styles'
import http from '../../../utilities/http'
import { Button, Icon } from '../../../component/Basic'
import { Checkbox } from '..'
import { bind } from '../../../utilities/component'

class RemotePicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      firstPage: true,
      listUrl: props.url,
      localData: null,
      list: [],
      localSearchList: [],
      selectedSingle: null,
      selectedMultiple: [],
      searchKey: '',
      autocomplete: props.autocomplete === true
    }

    bind(this)

    this.getUrl = this.getUrl.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onOpened = this.onOpened.bind(this)
    this.onClosed = this.onClosed.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
    this.autocomplete = this.autocomplete.bind(this)
    this.localSearch = this.localSearch.bind(this)
    this.fetchList = this.fetchList.bind(this)
    this.refineList = this.refineList.bind(this)
    this.refineListItem = this.refineListItem.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.applySelected = this.applySelected.bind(this)
    this.renderLabel = this.renderLabel.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderListFooterComponent = this.renderListFooterComponent.bind(this)
  }

  getUrl() {
    return typeof this.props.url === 'function' ? this.props.url() : this.props.url
  }

  async openModal() {
    let selectedSingle = null
    let selectedMultiple = []
    if (this.props.isMultipleSelection) {
      if (this.props.selected && this.props.selected.length) {
        selectedMultiple = this.props.selected.map(r => r.value)
      }
    } else {
      if (this.props.selected) {
        selectedSingle = this.props.selected.value
      }
    }
    await this.promisedSetState({
      selectedSingle,
      selectedMultiple,
      searchKey: '',
      firstPage: true,
      localData: this.props.localData,
      listUrl: this.getUrl(),
      list: [],
      localSearchList: []
    })
    this.refModal.open()
  }

  closeModal() {
    this.refModal.close()
  }

  onOpened() {
    this.fetchList('')
  }

  onClosed() {
  }

  onEndReached() {
    this.fetchList(this.state.searchKey)
  }

  async autocomplete(v) {
    await this.promisedSetState({
      searchKey: v,
      firstPage: true,
      listUrl: this.getUrl(),
      fetching: false,
      list: []
    })
    await this.fetchList(v)
  }

  async localSearch(v) {
    await this.promisedSetState({
      selectedSingle: null,
      selectedMultiple: [],
      searchKey: v,
      localSearchList: this.state.searchKey ? [...this.state.list.filter(item => item.label.includes(v))] : [...this.state.list]
    })
  }

  async fetchList(searchKey = '') {
    if (this.state.localData) {
      await this.promisedSetState({
        fetching: false,
        list: this.refineList([...this.state.localData])
      })
      return
    }
    if (!this.state.listUrl) {
      return
    }
    if (this.state.fetching) {
      return
    }
    await this.promisedSetState({
      fetching: true
    })
    if (this.source) {
      // this.source.cancel('Operation canceled by the user.')
      this.source.cancel('Operation canceled by the user.')
    }
    try {
      const params = {
        params: {}
      }
      if (searchKey != '') {
        params.params.key = searchKey
      }

      const CancelToken = axios.CancelToken
      this.source = CancelToken.source()
      params.cancelToken = this.source.token
      const r = (await http.get(this.state.listUrl, params)).data

      const items = this.refineList(this.props.processResult ? this.props.processResult(r) : r.items)

      if (items) {
        let listUrl = null
        if (r.pageUrlNext) {
          listUrl = r.pageUrlNext
        }

        if (!this.state.autocomplete || (this.state.autocomplete && this.state.searchKey === searchKey)) {
          await this.promisedSetState({
            list: this.state.firstPage ? items : [...this.state.list, ...items],
            localSearchList: [],
            listUrl,
            firstPage: false
          })
          if (this.props.isLocalSearch) {
            await this.localSearch(this.state.searchKey)
          }
        }
      }
    } catch (e) {
    }
    await this.promisedSetState({
      fetching: false
    })
  }

  refineList(list) {
    if (list) {
      return list.map(this.refineListItem)
    }
    return []
  }

  refineListItem(item) {
    const value = item[this.props.fieldValue]
    const label = this.props.getFieldLabel ? this.props.getFieldLabel(item) : item[this.props.fieldLabel]
    return { value, label }
  }

  selectItem(value) {
    if (this.props.isMultipleSelection) {
      const selectedMultiple = [...this.state.selectedMultiple]
      const index = selectedMultiple.indexOf(value)
      if (index === -1) {
        selectedMultiple.push(value)
      } else {
        selectedMultiple.splice(index, 1)
      }
      this.setState({
        selectedMultiple
      })
    } else {
      this.setState({
        selectedSingle: this.state.selectedSingle == value ? null : value
      })
    }
  }

  async applySelected() {
    let selected = null
    if (this.props.isMultipleSelection) {
      selected = []
      if (this.state.selectedMultiple.length) {
        const list = this.props.isLocalSearch ? this.state.localSearchList : this.state.list
        const selectedMultiple = this.state.selectedMultiple
        list.forEach(function (item) {
          if (selectedMultiple.includes(item.value)) {
            selected.push({ value: item.value, label: item.label, item })
          }
        })
      }
    } else {
      if (this.state.selectedSingle) {
        const item = (this.props.isLocalSearch ? this.state.localSearchList : this.state.list).find(r => r.value == this.state.selectedSingle)
        if (item) {
          selected = { value: item.value, label: item.label, item }
        }
        this.closeModal()
      }
    }
    this.props.onValueChange && this.props.onValueChange(selected)
    this.closeModal()
  }

  renderLabel() {
    let label = this.props.placeholder
    if (this.props.isMultipleSelection) {
      if (this.props.selected && this.props.selected.length) {
        label = this.props.selected[0].label + (this.props.selected.length > 1 ? '...' : '')
      }
    } else {
      if (this.props.selected) {
        label = this.props.selected.label
      }
    }
    return (
      <Button
        onPress={this.openModal}
        style={this.props.containerStyle}
      >
        <Text style={this.props.textStyle}>
          {label}
        </Text>
      </Button>
    )
  }

  renderItem({ item }) {
    let seleted = false
    if (this.props.isMultipleSelection) {
      seleted = this.state.selectedMultiple.includes(item.value)
    } else {
      seleted = this.state.selectedSingle === item.value
    }
    return (
      <Button
        key={item.value}
        style={styles.modalItem}
        onPress={() => this.selectItem(item.value)}
      >
        <Text style={styles.modalItemName}>{item.label}</Text>
        <Checkbox
          checked={seleted}
          style={styles.modalItemCheckbox}
          color='#999'
        />
      </Button>
    )
  }

  renderListFooterComponent() {
    return (
      <View>
        {
          this.state.fetching
            ? <ActivityIndicator />
            : null
        }
      </View>
    )
  }

  render() {
    const textInputProps = {
      placeholder: 'Search ...',
      placeholderTextColor: '',
      style: styles.modalSearchInputText,
      onChangeText: v => (this.setState({ searchKey: v }))
    }
    if (this.props.isLocalSearch) {
      textInputProps.clearButtonMode = 'while-editing'
      textInputProps.onChangeText = v => (this.localSearch(v))
    } else if (this.state.autocomplete) {
      textInputProps.clearButtonMode = 'while-editing'
      textInputProps.onChangeText = v => (this.autocomplete(v))
    }
    return (
      <>
        {this.renderLabel()}
        <Modal
          ref={c => (this.refModal = c)}
          style={styles.modal}
          swipeToClose={false}
          backdropPressToClose={false}
          backButtonClose={false}
          coverScreen
          onOpened={this.onOpened}
          onClosed={this.onClosed}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>{this.props.placeholderModal || this.props.placeholder || 'Search'}</Text>
              <Button style={styles.modalHeaderBtn}>
                <Icon name='close' type='MaterialIcons' style={styles.modalHeaderBtnIcon} onPress={this.closeModal} />
              </Button>
            </View>
            {
              this.props.showSearch
                ? (
                  <View style={styles.modalSearch}>
                    <View style={styles.modalSearchInput}>
                      <TextInput
                        {...textInputProps}
                      />
                      {
                        this.state.autocomplete || this.props.isLocalSearch
                          ? null
                          : (
                            <Button
                              style={styles.modalSearchBtn}
                              onPress={async () => {
                                const url = this.getUrl()
                                await this.promisedSetState({
                                  listUrl: url + (this.state.searchKey ? '?key=' + this.state.searchKey : ''),
                                  firstPage: true
                                })
                                this.fetchList(this.state.searchKey)
                              }}
                            >
                              <Icon name='search' type='FontAwesome' style={styles.modalSearchBtnIcon} />
                            </Button>
                          )
                      }
                    </View>
                  </View>
                )
                : null
            }
            <View style={styles.modalContent}>
              <FlatList
                data={this.props.isLocalSearch ? this.state.localSearchList : this.state.list}
                extraData={{
                  fetching: this.state.fetching
                }}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.value}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.01}
                ListFooterComponent={this.renderListFooterComponent}
              />
            </View>
            <View style={styles.modalFooter}>
              <Button
                style={styles.modalFooterBtn}
                onPress={this.applySelected}
              >
                <Text style={styles.modalFooterBtnText}>Apply</Text>
              </Button>
            </View>
          </SafeAreaView>
        </Modal>
      </>
    )
  }
}

RemotePicker.propTypes = {
  isMultipleSelection: PropTypes.bool,
  showSearch: PropTypes.bool,
  isLocalSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  placeholderModal: PropTypes.string,
  localData: PropTypes.array,
  url: PropTypes.string.isRequired,
  selected: PropTypes.shape({
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  fieldLabel: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  getFieldLabel: PropTypes.func,
  onValueChange: PropTypes.func,
  textStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  containerStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

RemotePicker.defaultProps = {
  isMultipleSelection: false,
  localData: null,
  autocomplete: false,
  showSearch: false,
  isLocalSearch: false,
  placeholder: '',
  placeholderModal: '',
  fieldLabel: 'label',
  fieldValue: 'value',
  textStyle: styles.formSelect,
  containerStyle: { width: '100%' },
  getFieldLabel: null
}

export default RemotePicker
