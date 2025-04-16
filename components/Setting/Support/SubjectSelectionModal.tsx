import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { images } from '@/constants';

interface SubjectSelectionModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    selectedSubject: string | null;
    setSelectedSubject: (subject: string) => void;
}

const subjects = ['Send', 'Receive', 'Buy', 'Swap', 'Withdraw', 'Others'];

const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({
    modalVisible,
    setModalVisible,
    selectedSubject,
    setSelectedSubject,
}) => {
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const titleColor = useThemeColor({ light: '#25AE7A', dark: '#25AE7A' }, 'title');
    const modalBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'modal');
    const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2A2A2A' }, 'card');
    const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
    const close = useThemeColor({ light: images.cross_white, dark: images.cross_black }, 'close');

    return (
        <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: modalBackgroundColor }]}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: titleColor }]}>Subject</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.closeButton, { backgroundColor }]}>
                            <Image source={close} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />

                    {/* Subject List */}
                    <View style={styles.subjectList}>
                        <FlatList
                            data={subjects}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        { backgroundColor: cardBackgroundColor },
                                        selectedSubject === item && styles.selectedOption,
                                    ]}
                                    onPress={() => {
                                        setSelectedSubject(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <View style={styles.radioContainer}>
                                        {selectedSubject === item && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.optionText, { color: textColor }]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        borderRadius: 20,
        paddingVertical: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Caprasimo',
    },
    closeButton: {
        padding: 5,
        borderRadius: 25,
        borderWidth: 1,
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
        marginTop: 2,
    },
    subjectList: {
        marginHorizontal: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: '#F0FFF5',
    },
    optionText: {
        fontSize: 16,
    },
    radioContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#25AE7A', // always green outline
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#25AE7A', // green fill for selected
    },

});

export default SubjectSelectionModal;
