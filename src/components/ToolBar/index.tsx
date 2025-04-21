import { BookDropDown } from './BookDropDown';
import { VocabularyList } from './VocabularyList';

export const ToolBar = () => {
    return <div className=' fixed top-5 right-5 '>
        <BookDropDown onChange={(value) => {
            console.log(value)
        }} />
        {/* <VocabularyList /> */}
    </div>
}