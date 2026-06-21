import Article from '../../models/catalog/Articles.model';
import Section from '../../models/catalog/Sections.model';

export class CatalogRepository {
    // Consultas para Artículos
    async fetchAllArticles() {
        return await Article.find({}).populate('sectionId', 'name description');
    }

    async persistArticle(articleData: any) {
        const newArticle = new Article(articleData);
        return await newArticle.save();
    }

    // Consultas para Secciones
    async persistSection(sectionData: any) {
        const newSection = new Section(sectionData);
        return await newSection.save();
    }

    async fetchAllSections() {
        return await Section.find({ isActive: true });
    }
}