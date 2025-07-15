import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { TagService } from '@/services/tagService';
import { CategoryService } from '@/services/categoryService';
import { GroupService } from '@/services/groupService';

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
}

interface UploadTabProps {
    isActive?: boolean;
}

function UploadTab({ isActive }: UploadTabProps) {
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [accessType, setAccessType] = useState<'PRIVATE' | 'GROUP'>('PRIVATE');
    const [categoryId, setCategoryId] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [groupId, setGroupId] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [Tags, setTags] = useState<Tag[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [tagResponse, categoryResponse, groupResponse] =
                    await Promise.all([
                        TagService.getTag(),
                        CategoryService.getCategories(),
                        GroupService.getMygroups(),
                    ]);
                setTags(tagResponse.data || []);
                setCategories(categoryResponse.data || []);
                setGroups(groupResponse.data || []);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Modals state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const handleFileSelection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                ],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];

                // Kiểm tra kích thước file (giới hạn 10MB)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (selectedFile.size && selectedFile.size > maxSize) {
                    Alert.alert('Lỗi', 'Kích thước tệp không được vượt quá 10MB');
                    return;
                }
                
                setFile(selectedFile);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Lỗi', 'Không thể chọn tệp. Vui lòng thử lại.');
        }
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        // Validation
        if (!file) {
            Alert.alert('Lỗi', 'Vui lòng chọn tệp tài liệu');
            return;
        }
        if (!title.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
            return;
        }
        if (!categoryId) {
            Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
            return;
        }
        if (accessType === 'GROUP' && !groupId) {
            Alert.alert('Lỗi', 'Vui lòng chọn nhóm khi chia sẻ với nhóm');
            return;
        }

        setIsUploading(true);

        try {
            const formDataToSend = new FormData();
            
            // Tạo object file cho FormData
            const fileObject = {
                uri: file.uri,
                type: file.mimeType || 'application/octet-stream',
                name: file.name,
            } as any;
            
            formDataToSend.append("file", fileObject);
            formDataToSend.append("title", title.trim());
            formDataToSend.append("description", description.trim());
            formDataToSend.append("accessType", accessType);
            formDataToSend.append("categoryId", categoryId);
            
            if (selectedTags.length > 0) {
                selectedTags.forEach((tagId) => {
                    formDataToSend.append("tagIds[]", tagId);
                });
            }
            
            if (accessType === "GROUP" && groupId) {
                formDataToSend.append("groupId", groupId);
            }

            // Gọi API thực tế ở đây
            // const response = await YourUploadService.uploadDocument(formDataToSend);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Alert.alert('Thành công', 'Tài liệu đã được tải lên thành công!');
            
            // Reset form
            setFile(null);
            setTitle('');
            setDescription('');
            setAccessType('PRIVATE');
            setCategoryId('');
            setSelectedTags([]);
            setGroupId('');
            
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải lên tài liệu');
        } finally {
            setIsUploading(false);
        }
    };

    const getCategoryName = (id: string) => {
        return categories.find(cat => cat.id === id)?.name || 'Chọn danh mục';
    };

    const getGroupName = (id: string) => {
        return groups.find(group => group.id === id)?.name || 'Chọn nhóm';
    };

    const getSelectedTagNames = () => {
        return Tags
            .filter((tag: Tag) => selectedTags.includes(tag.id))
            .map((tag: Tag) => tag.name);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="cloud-upload-outline" size={48} color="#007bff" />
                <Text style={styles.title}>Tải lên tài liệu mới</Text>
                <Text style={styles.subtitle}>Chia sẻ kiến thức của bạn với cộng đồng</Text>
            </View>

            {/* File Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tệp tài liệu *</Text>
                <TouchableOpacity 
                    style={[styles.fileSelector, file && styles.fileSelectorSelected]}
                    onPress={handleFileSelection}
                >
                    <Ionicons 
                        name={file ? "document-text" : "document-attach-outline"} 
                        size={24} 
                        color={file ? "#28a745" : "#6c757d"} 
                    />
                    <View style={styles.fileInfo}>
                        <Text style={[styles.fileSelectorText, file && styles.fileSelectorTextSelected]}>
                            {file ? file.name : "Nhấn để chọn tệp"}
                        </Text>
                        {file && file.size && (
                            <Text style={styles.fileSize}>
                                {formatFileSize(file.size)}
                            </Text>
                        )}
                    </View>
                    {file && (
                        <TouchableOpacity 
                            style={styles.removeFileButton}
                            onPress={() => setFile(null)}
                        >
                            <Ionicons name="close-circle" size={20} color="#dc3545" />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
                <Text style={styles.fileNote}>
                    Hỗ trợ: PDF. Tối đa 10MB.
                </Text>
            </View>

            {/* Title */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tiêu đề *</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Nhập tiêu đề tài liệu..."
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />
                <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Mô tả nội dung tài liệu..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                />
                <Text style={styles.characterCount}>{description.length}/500</Text>
            </View>

            {/* Category */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Danh mục *</Text>
                <TouchableOpacity 
                    style={styles.selector}
                    onPress={() => setShowCategoryModal(true)}
                >
                    <Text style={[styles.selectorText, categoryId && styles.selectorTextSelected]}>
                        {getCategoryName(categoryId)}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#6c757d" />
                </TouchableOpacity>
            </View>

            {/* Tags */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thẻ</Text>
                <TouchableOpacity 
                    style={styles.selector}
                    onPress={() => setShowTagModal(true)}
                >
                    <Text style={[styles.selectorText, selectedTags.length > 0 && styles.selectorTextSelected]}>
                        {selectedTags.length > 0 
                            ? `Đã chọn ${selectedTags.length} thẻ` 
                            : "Chọn thẻ"
                        }
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#6c757d" />
                </TouchableOpacity>
                {selectedTags.length > 0 && (
                    <View style={styles.tagContainer}>
                        {getSelectedTagNames().map((tagName, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tagName}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Access Type */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quyền truy cập *</Text>
                <View style={styles.accessTypeContainer}>
                    {[
                        { key: 'PRIVATE', label: 'Riêng tư', icon: 'lock-closed-outline' },
                        { key: 'GROUP', label: 'Nhóm', icon: 'people-outline' },
                    ].map((option) => (
                        <TouchableOpacity 
                            key={option.key}
                            style={[
                                styles.accessTypeOption,
                                accessType === option.key && styles.accessTypeOptionSelected
                            ]}
                            onPress={() => setAccessType(option.key as any)}
                        >
                            <Ionicons 
                                name={option.icon as any} 
                                size={20} 
                                color={accessType === option.key ? "#007bff" : "#6c757d"} 
                            />
                            <Text style={[
                                styles.accessTypeText,
                                accessType === option.key && styles.accessTypeTextSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Group Selection (only when GROUP is selected) */}
            {accessType === 'GROUP' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chọn nhóm *</Text>
                    <TouchableOpacity 
                        style={styles.selector}
                        onPress={() => setShowGroupModal(true)}
                    >
                        <Text style={[styles.selectorText, groupId && styles.selectorTextSelected]}>
                            {getGroupName(groupId)}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6c757d" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Upload Button */}
            <TouchableOpacity 
                style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
                onPress={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Ionicons name="cloud-upload" size={20} color="#fff" />
                )}
                <Text style={styles.uploadButtonText}>
                    {isUploading ? 'Đang tải lên...' : 'Tải lên tài liệu'}
                </Text>
            </TouchableOpacity>

            {/* Category Modal */}
            <Modal visible={showCategoryModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn danh mục</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.modalItem,
                                        categoryId === item.id && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setCategoryId(item.id);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        categoryId === item.id && styles.modalItemTextSelected
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {categoryId === item.id && (
                                        <Ionicons name="checkmark" size={20} color="#007bff" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Tag Modal */}
            <Modal visible={showTagModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn thẻ</Text>
                            <TouchableOpacity onPress={() => setShowTagModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={Tags}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.modalItem,
                                        selectedTags.includes(item.id) && styles.modalItemSelected
                                    ]}
                                    onPress={() => handleTagToggle(item.id)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        selectedTags.includes(item.id) && styles.modalItemTextSelected
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {selectedTags.includes(item.id) && (
                                        <Ionicons name="checkmark" size={20} color="#007bff" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Group Modal */}
            <Modal visible={showGroupModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn nhóm</Text>
                            <TouchableOpacity onPress={() => setShowGroupModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={groups}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.modalItem,
                                        groupId === item.id && styles.modalItemSelected
                                    ]}
                                    onPress={() => {
                                        setGroupId(item.id);
                                        setShowGroupModal(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        groupId === item.id && styles.modalItemTextSelected
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {groupId === item.id && (
                                        <Ionicons name="checkmark" size={20} color="#007bff" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#212529",
        marginTop: 12,
    },
    subtitle: {
        fontSize: 14,
        color: "#6c757d",
        marginTop: 4,
        textAlign: "center",
    },
    section: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#212529",
        marginBottom: 12,
    },
    fileSelector: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#e9ecef",
        borderStyle: "dashed",
    },
    fileSelectorSelected: {
        backgroundColor: "#e7f3ff",
        borderColor: "#007bff",
        borderStyle: "solid",
    },
    fileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    fileSelectorText: {
        fontSize: 14,
        color: "#6c757d",
    },
    fileSelectorTextSelected: {
        color: "#007bff",
        fontWeight: "500",
    },
    fileSize: {
        fontSize: 12,
        color: "#6c757d",
        marginTop: 2,
    },
    fileNote: {
        fontSize: 12,
        color: "#6c757d",
        marginTop: 8,
        fontStyle: "italic",
    },
    removeFileButton: {
        marginLeft: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#e9ecef",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: "#212529",
        backgroundColor: "#fff",
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    characterCount: {
        fontSize: 12,
        color: "#6c757d",
        textAlign: "right",
        marginTop: 4,
    },
    selector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderWidth: 1,
        borderColor: "#e9ecef",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    selectorText: {
        fontSize: 14,
        color: "#6c757d",
    },
    selectorTextSelected: {
        color: "#212529",
        fontWeight: "500",
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
    },
    tag: {
        backgroundColor: "#e7f3ff",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: "#007bff",
        fontWeight: "500",
    },
    accessTypeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    accessTypeOption: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#e9ecef",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    accessTypeOptionSelected: {
        backgroundColor: "#e7f3ff",
        borderColor: "#007bff",
    },
    accessTypeText: {
        fontSize: 12,
        color: "#6c757d",
        marginLeft: 6,
        fontWeight: "500",
    },
    accessTypeTextSelected: {
        color: "#007bff",
    },
    uploadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        marginHorizontal: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: "#007bff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    uploadButtonDisabled: {
        backgroundColor: "#6c757d",
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f3f4",
    },
    modalItemSelected: {
        backgroundColor: "#e7f3ff",
    },
    modalItemText: {
        fontSize: 14,
        color: "#212529",
    },
    modalItemTextSelected: {
        color: "#007bff",
        fontWeight: "500",
    },
    bottomSpacer: {
        height: 32,
    },
});

export default UploadTab;