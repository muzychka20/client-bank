import matplotlib.pyplot as plt
import numpy as np
import itertools
import re


class Utils:

    __replacements = [
        ('I', 'І'),
        ('i', 'і'),
        ('ІПН', ' '),
        (',', ' '),
        (';', ' '),
        ('.', ' '),
        ('_', ' '),
        ('#', ' '),
        ('/', ' '),
        (':', ' '),
        ('*', ' '),
    ]

    __phone_replacements = [
        ('(', ''),
        (')', ''),
        ('-', ''),
        ('+', ''),    
    ]


    @staticmethod
    def normalize_string(string):
        for old, new in Utils.__replacements:
            string = string.replace(old, new)
        string = re.sub(r'\s+', ' ', string).strip()    
        return string


    @staticmethod
    def normalize_phone(string):
        for old, new in Utils.__phone_replacements:
            string = string.replace(old, new)
        return string.lstrip('38')

    @staticmethod
    def plot_confusion_matrix(cm, classes, normalize=False, title='Confusion matrix', cmap=plt.cm.Blues):
        plt.imshow(cm, interpolation='nearest', cmap=cmap)
        plt.title(title)
        plt.colorbar()
        tick_marks = np.arange(len(classes))
        plt.xticks(tick_marks, classes, rotation=45)
        plt.yticks(tick_marks, classes)
        
        if normalize:
            cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
            print("Normalized confusion matrix")
        else:
            print('Confusion matrix, without normalization')
        
        print(cm)
        
        thresh = cm.max() / 2.
        for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
            plt.text(j, i, cm[i, j], horizontalalignment="center", color="white" if cm[i, j] > thresh else "black")
        
        plt.tight_layout()
        plt.ylabel("True label")
        plt.xlabel("Predicted label")
        plt.show()
  
    @staticmethod   
    def plot_chart(correct_values, false_values):
        # Data
        categories = ['Correct Names', 'False Names']
        values = [correct_values, false_values]

        # Create the bar chart
        plt.figure(figsize=(8, 6))
        plt.bar(categories, values, color=['green', 'red'], alpha=0.8)

        # Add titles and labels
        plt.title('Name Detection Results', fontsize=16)
        plt.xlabel('Category', fontsize=12)
        plt.ylabel('Count', fontsize=12)

        # Annotate the bars with values
        for i, value in enumerate(values):
            plt.text(i, value + 1, str(value), ha='center', fontsize=12, color='black')

        # Show the plot
        plt.tight_layout()
        plt.show()