<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\CreateMediaObjectAction;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @Vich\Uploadable
 */
#[ORM\Entity]
#[ApiResource(
    collectionOperations: [
        'get',
        'post' => [
            'controller' => CreateMediaObjectAction::class,
            'deserialize' => false,
            'validation_groups' => ['Default', 'media_object_create'],
            'openapi_context' => [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    iri: 'http://schema.org/MediaObject',
    itemOperations: ['get'],
    normalizationContext: ['groups' => ['media_object:read']]
)]
class MediaObject
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['media_object:read', "impact", 'items', 'events'])]
    public ?string $contentUrl = null;

    /**
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="filePath")
     */
    #[Assert\NotNull(groups: ['media_object_create'])]
    public ?File $file = null;

    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
