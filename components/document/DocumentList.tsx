// DocumentList.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import DocumentCard from './DocumentCard';
import { Document } from '@/types/document';

const { width } = Dimensions.get('window');

interface DocumentListProps {
  documents: Document[];
  onDocumentPress?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentPress }) => {
  const renderDocumentItem = ({ item }: { item: Document }) => (
    <DocumentCard document={item} onPress={onDocumentPress} />
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(data, index) => ({
          length: width * 0.42 + 12,
          offset: (width * 0.42 + 12) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { 
    paddingLeft: 20,
  },
  contentContainer: {
    paddingRight: 20,
  },
  itemSeparator: { 
    width: 12,
  },
});

export default DocumentList;