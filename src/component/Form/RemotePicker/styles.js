import { COLOR, FAMILY, SIZE } from '../../../theme/typography'

export default {
  formSelect: {
    backgroundColor: COLOR.SMOKE,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.secondary,
    paddingHorizontal: 20,
    paddingVertical: 15
  },

  modal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000
  },
  modalContainer: {
    height: '100%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalHeaderTitle: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_18,
    color: COLOR.dark,
    paddingHorizontal: 15
  },
  modalHeaderBtn: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  modalHeaderBtnIcon: {
    fontSize: SIZE.SIZE_24,
    color: COLOR.secondary
  },

  modalSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  modalSearchInput: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLOR.SMOKE,
    borderRadius: 10
  },
  modalSearchInputText: {
    flex: 1,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.secondary,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  modalSearchBtn: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  modalSearchBtnIcon: {
    fontSize: SIZE.SIZE_24,
    color: COLOR.secondary
  },

  modalContent: {
    flex: 1,
    paddingVertical: 15
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.GREYLIGHT
  },
  modalItemText: {
    flex: 1,
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.secondary
  },
  modalItemCheckbox: {
    marginRight: 10
  },
  modalItemName: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.secondary
  },

  modalFooter: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  modalFooterBtn: {
    flexDirection: 'row',
    backgroundColor: COLOR.default,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  modalFooterBtnText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_14,
    color: COLOR.LIGHT
  },
  modalFooterBtnIcon: {
    fontSize: SIZE.SIZE_24,
    color: COLOR.LIGHT
  }

}
