<?php


namespace App\Entity\Main;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Serializer\Filter\GroupFilter;
use App\Entity\MediaObject;
use App\Repository\ImpactRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ImpactRepository::class)]
#[ApiResource(
    itemOperations: [
        "get",
        "patch",
        "delete"
    ],
    normalizationContext: ['groups' => ['impact']]
)]
#[ApiFilter(
    GroupFilter::class,
    arguments: [
        'parameterName' => 'group'
    ]
)]

class Impact
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['impact'])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    #[Groups(['impact'])]
    private $title = "";

    #[ORM\Column(type: "string", length: 1000)]
    #[Groups(['impact'])]
    private $description = "";

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(iri: 'http://schema.org/image')]
    #[Groups(['impact'])]
    public ?MediaObject $image = null;

    #[ORM\Column(type: "integer")]
    #[Groups(['impact'])]
    private $recycling = 0;

    #[ORM\ManyToOne(targetEntity: Waste::class, inversedBy: "impacts")]
    #[Assert\NotNull]
    #[Groups(['impact'])]
    private $waste;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getRecycling(): ?int
    {
        return $this->recycling;
    }

    public function setRecycling(int $recycling): self
    {
        $this->recycling = $recycling;

        return $this;
    }

    public function getWaste(): ?Waste
    {
        return $this->waste;
    }

    public function setWaste(?Waste $waste): self
    {
        $this->waste = $waste;

        return $this;
    }

    public function getImage(): ?MediaObject
    {
        return $this->image;
    }

    public function setImage(?MediaObject $image): self
    {
        $this->image = $image;

        return $this;
    }
}
